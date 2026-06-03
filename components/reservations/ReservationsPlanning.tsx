"use client";

import { useEffect, useMemo, useState } from "react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import type { Apartment, Reservation } from "@/types";
import { PLATFORMS } from "@/utils/constants";

// ─── types ────────────────────────────────────────────────────────────────────

interface Props {
	reservations: Reservation[];
	apartments: Apartment[];
	onReservationClick: (reservation: Reservation) => void;
	onReservationDoubleClick: (reservation: Reservation) => void;
}

type View = "day" | "week" | "2weeks" | "month";

// ─── helpers ──────────────────────────────────────────────────────────────────

function midnight(d: Date) {
	const c = new Date(d);
	c.setHours(0, 0, 0, 0);
	return c;
}

function addDays(d: Date, n: number) {
	const c = new Date(d);
	c.setDate(c.getDate() + n);
	return c;
}

function isoDate(d: Date) {
	return d.toISOString().split("T")[0];
}

function sameDay(a: Date, b: Date) {
	return isoDate(a) === isoDate(b);
}

function isWeekend(d: Date) {
	const day = d.getDay();
	return day === 0 || day === 6;
}

function viewLength(v: View) {
	return { day: 1, week: 7, "2weeks": 14, month: 31 }[v];
}

// Static min-widths — never read window here to avoid SSR mismatch.
// The responsive week column width is handled via useWindowWidth() in the main component.
function colMinWidth(v: View): number {
	if (v === "day") return 160;
	if (v === "week") return 110; // overridden at render time via weekColWidth
	if (v === "2weeks") return 80;
	return 52;
}

// Safe hook: returns 0 on the server / before first paint, real width after hydration.
function useWindowWidth() {
	const [width, setWidth] = useState(0);
	useEffect(() => {
		const update = () => setWidth(window.innerWidth);
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);
	return width;
}

function getPlatformStyle(platform?: string) {
	const match = PLATFORMS.find((p) => p.value === platform);
	return {
		bg: match?.bg ?? "rgba(255,255,255,0.08)",
		color: match?.color ?? "#888",
		label: match?.label ?? "Autre",
	};
}

// Resolves apartmentId whether it is a populated object or a plain string/ObjectId.
function resolveApartmentId(apartmentId: Reservation["apartmentId"]): string {
	if (!apartmentId) return "";
	if (typeof apartmentId === "string") return apartmentId;
	if (typeof apartmentId === "object" && "_id" in apartmentId) return String(apartmentId._id);
	return String(apartmentId);
}

// ─── span helpers ─────────────────────────────────────────────────────────────

const CHECKOUT_FRACTION = 0.48;
const CHECKIN_OFFSET = 0.52;

function getSpan(
	r: Reservation,
	days: Date[],
): {
	colStart: number;
	colSpan: number;
	checkoutInView: boolean;
	checkoutIdx: number;
	startsHere: boolean;
	endsHere: boolean;
	startsBeforeView: boolean;
	endsAfterView: boolean;
} | null {
	const checkIn = midnight(new Date(r.checkIn));
	const checkOut = midnight(new Date(r.checkOut));

	let colStart = -1;
	let colSpan = 0;

	for (let i = 0; i < days.length; i++) {
		const d = days[i];
		if (d >= checkIn && d < checkOut) {
			if (colStart === -1) colStart = i;
			colSpan++;
		}
	}

	const checkoutIdx = days.findIndex((d) => sameDay(d, checkOut));
	const checkoutInView = checkoutIdx >= 0;

	if (colStart === -1 && !checkoutInView) return null;

	if (colStart === -1) {
		return {
			colStart: checkoutIdx,
			colSpan: 0,
			checkoutInView: true,
			checkoutIdx,
			startsHere: false,
			endsHere: false,
			startsBeforeView: true,
			endsAfterView: false,
		};
	}

	return {
		colStart,
		colSpan,
		checkoutInView,
		checkoutIdx,
		startsHere: sameDay(days[colStart], checkIn),
		endsHere: colSpan > 0 && sameDay(days[colStart + colSpan - 1], addDays(checkOut, -1)),
		startsBeforeView: checkIn < days[0],
		endsAfterView: checkOut > addDays(days[days.length - 1], 1),
	};
}

// ─── day header ───────────────────────────────────────────────────────────────

function DayHeader({ day, view, isToday }: { day: Date; view: View; isToday: boolean }) {
	return (
		<div
			className={`flex flex-col items-center justify-center py-2 text-center text-[11px] font-medium
				${isToday ? "!text-violet-400 font-semibold" : "text-gray-500"}
			`}
		>
			{view === "month" ? (
				<span>{day.toLocaleDateString("fr-FR", { day: "2-digit" })}</span>
			) : (
				<>
					<span className="uppercase tracking-wide" style={{ fontSize: 9 }}>
						{day.toLocaleDateString("fr-FR", { weekday: "short" })}
					</span>
					<span
						className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs
							${isToday ? "bg-violet-500 text-white" : ""}
						`}
					>
						{day.getDate()}
					</span>
				</>
			)}
		</div>
	);
}

// ─── apartment row ────────────────────────────────────────────────────────────

function ApartmentRow({
	apartment,
	days,
	reservations,
	view,
	today,
	effectiveColWidth,
	onReservationClick,
	onReservationDoubleClick,
}: {
	apartment: Apartment;
	days: Date[];
	reservations: Reservation[];
	view: View;
	today: Date;
	effectiveColWidth: number;
	onReservationClick: (r: Reservation) => void;
	onReservationDoubleClick: (r: Reservation) => void;
}) {
	const N = days.length;

	const spans = useMemo(() => {
		return reservations
			.map((r) => {
				const span = getSpan(r, days);
				return span ? { r, ...span } : null;
			})
			.filter(Boolean) as Array<{
			r: Reservation;
			colStart: number;
			colSpan: number;
			checkoutInView: boolean;
			checkoutIdx: number;
			startsHere: boolean;
			endsHere: boolean;
			startsBeforeView: boolean;
			endsAfterView: boolean;
		}>;
	}, [reservations, days]);

	const todayIdx = days.findIndex((d) => sameDay(d, today));

	return (
		<div className="flex border-b border-white/20 last:border-0">
			{/* sticky label */}
			<div className="sticky left-0 z-30 flex w-[180px] shrink-0 items-center gap-2.5 border-r border-white/20 bg-[#111827] px-3 py-2">
				<img
					src={apartment.image}
					onError={(e) => {
						e.currentTarget.src = "/images/house-placeholder.jpg";
					}}
					className="h-8 w-8 shrink-0 rounded-lg object-cover"
					alt={apartment.name}
				/>
				<span className="truncate text-xs font-medium text-white">{apartment.name}</span>
			</div>

			{/* day grid */}
			<div
				className="relative min-h-[52px] flex-1 bg-[#0F1117]"
				style={{
					display: "grid",
					gridTemplateColumns: `repeat(${N}, minmax(${effectiveColWidth}px, 1fr))`,
				}}
			>
				{/* background cells */}
				{days.map((d) => (
					<div
						key={isoDate(d)}
						className={`border-r border-white/20 
							${sameDay(d, today) ? "bg-violet-500/[0.04]" : ""}
						`}
					/>
				))}

				{/* today vertical line */}
				{todayIdx >= 0 && (
					<div
						className="pointer-events-none absolute inset-y-0 z-10"
						style={{
							left: `calc(${(todayIdx / N) * 100}%)`,
							width: `calc(${(1 / N) * 100}%)`,
							borderLeft: "1px solid rgba(139,92,246,0.25)",
							borderRight: "1px solid rgba(139,92,246,0.25)",
						}}
					/>
				)}

				{/* reservation banners */}
				{spans.map(({ r, colStart, colSpan, checkoutInView, startsHere, startsBeforeView, endsAfterView }) => {
					const checkinShift = startsHere ? CHECKIN_OFFSET : 0;
					const effectiveCols = colSpan - checkinShift + (checkoutInView ? CHECKOUT_FRACTION : 0);
					const GAP = 2;
					const left = `calc(${((colStart + checkinShift) / N) * 100}% + ${GAP}px)`;
					const width = `calc(${(effectiveCols / N) * 100}% - ${GAP * 2}px)`;

					const incomplete = !r.guestName || !r.totalAmount;
					const missingFromSync = r.missingFromSync;
					const platformStyle = getPlatformStyle(r.platform);

					return (
						<button
							key={r._id}
							onClick={() => onReservationClick(r)}
							onDoubleClick={() => onReservationDoubleClick(r)}
							title={r.guestName ?? "À compléter"}
							style={{
								left,
								width,
								backgroundColor: missingFromSync || incomplete ? undefined : platformStyle.bg,
							}}
							className={`group absolute inset-y-[7px] z-20 flex items-center overflow-hidden border px-2.5 text-left transition-opacity hover:opacity-80
								${startsBeforeView ? "rounded-l-none" : "rounded-l-md"}
								${endsAfterView ? "rounded-r-none" : "rounded-r-md"}
								${missingFromSync ? "border-dashed border-amber-500/50 bg-amber-700/60 text-amber-100" : incomplete ? "border-violet-500/50 bg-violet-700/80 text-violet-200" : "border-white/10 text-white/90"}`}
						>
							<div className="flex min-w-0 flex-1 items-center gap-1.5">
								{incomplete || missingFromSync ? <span className="shrink-0 text-[11px] text-amber-400">⚠</span> : null}
								<span className="truncate text-[11px] font-medium">{r.guestName ?? "À compléter"}</span>
							</div>

							{missingFromSync ? (
								<div className="flex min-w-0 flex-1 items-center gap-1.5">
									<span className="truncate text-[11px] font-medium">{"Non synchronisée"}</span>
								</div>
							) : null}

							{r.platform && colSpan > 1 && (
								<div className="ml-2 shrink-0">
									<PlatformIcon platform={r.platform} logoOnly />
								</div>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}

// ─── main component ───────────────────────────────────────────────────────────

const VIEW_LABELS: Record<View, string> = {
	day: "Jour",
	week: "Semaine",
	"2weeks": "2 semaines",
	month: "Mois",
};

export default function ReservationsPlanning({ reservations = [], apartments = [], onReservationClick, onReservationDoubleClick }: Props) {
	const [view, setView] = useState<View>("week");
	const [offset, setOffset] = useState(0);

	// Responsive week column width — read window only client-side to avoid hydration mismatch.
	// windowWidth === 0 means SSR or before first paint: fall back to 110 (same as SSR).
	const windowWidth = useWindowWidth();
	const weekColWidth = windowWidth === 0 ? 110 : windowWidth > 1440 ? 90 : 110;
	const effectiveColWidth = view === "week" ? weekColWidth : colMinWidth(view);

	const today = useMemo(() => midnight(new Date()), []);

	const days = useMemo(() => {
		const len = viewLength(view);
		const start = addDays(today, offset * len);
		return Array.from({ length: len }, (_, i) => addDays(start, i));
	}, [view, offset, today]);

	const periodLabel = useMemo(() => {
		const first = days[0];
		const last = days[days.length - 1];
		if (view === "day") {
			return first.toLocaleDateString("fr-FR", {
				weekday: "long",
				day: "numeric",
				month: "long",
				year: "numeric",
			});
		}
		if (first.getMonth() === last.getMonth()) {
			return first.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
		}
		return `${first.toLocaleDateString("fr-FR", { month: "short" })} – ${last.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`;
	}, [days, view]);

	return (
		<div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">
			{/* toolbar */}
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 px-5 py-3">
				<div className="flex items-center gap-2">
					<button onClick={() => setOffset(0)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 hover:bg-white/5">
						Aujourd'hui
					</button>
					<button onClick={() => setOffset((o) => o - 1)} className="rounded-lg border border-white/10 p-1.5 text-gray-400 hover:bg-white/5">
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
							<path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
					<span className="min-w-[160px] text-center text-sm font-medium capitalize text-white">{periodLabel}</span>
					<button onClick={() => setOffset((o) => o + 1)} className="rounded-lg border border-white/10 p-1.5 text-gray-400 hover:bg-white/5">
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
							<path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
				</div>

				<div className="flex gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
					{(Object.keys(VIEW_LABELS) as View[]).map((v) => (
						<button
							key={v}
							onClick={() => {
								setView(v);
								setOffset(0);
							}}
							className={`rounded-lg px-3 py-1.5 text-xs transition
								${view === v ? "bg-white/10 font-medium text-white" : "text-gray-500 hover:text-gray-300"}
							`}
						>
							{VIEW_LABELS[v]}
						</button>
					))}
				</div>
			</div>

			{/* scrollable grid — w-0 min-w-full confines the scroll to this component */}
			<div className="w-0 min-w-full overflow-x-auto">
				<div style={{ minWidth: 180 + days.length * effectiveColWidth }}>
					{/* header row */}
					<div className="sticky top-0 z-30 flex border-b border-white/20 bg-[#111827]">
						<div className="sticky left-0 z-40 w-[180px] shrink-0 border-r border-white/20 bg-[#111827] px-3 py-2 text-[10px] uppercase tracking-widest text-gray-600">Logement</div>
						<div
							className="flex-1"
							style={{
								display: "grid",
								gridTemplateColumns: `repeat(${days.length}, minmax(${effectiveColWidth}px, 1fr))`,
							}}
						>
							{days.map((d) => (
								<DayHeader key={isoDate(d)} day={d} view={view} isToday={sameDay(d, today)} />
							))}
						</div>
					</div>

					{/* apartment rows */}
					{apartments.length === 0 && <div className="py-16 text-center text-sm text-gray-600">Aucun logement configuré</div>}
					{apartments.map((apt) => (
						<ApartmentRow
							key={apt._id}
							apartment={apt}
							days={days}
							reservations={reservations.filter((r) => resolveApartmentId(r.apartmentId) === apt._id)}
							view={view}
							today={today}
							effectiveColWidth={effectiveColWidth}
							onReservationClick={onReservationClick}
							onReservationDoubleClick={onReservationDoubleClick}
						/>
					))}
				</div>
			</div>

			{/* legend */}
			<div className="sticky bottom-0 z-30 flex flex-wrap gap-3 border-t border-white/[0.06] px-4 py-3 text-[11px] text-gray-500">
				{PLATFORMS.map((p) => (
					<div key={p.value} className="flex items-center gap-1.5">
						<span className="h-3.5 w-4 rounded-sm" style={{ background: p.bg }} />
						<span>{p.label}</span>
					</div>
				))}
				<div className="flex items-center gap-1.5">
					<span className="h-3.5 w-4 rounded-sm border border-violet-500/50 bg-violet-700/60" />
					<span>À compléter</span>
				</div>
				<div className="flex items-center gap-1.5">
					<span className="h-3.5 w-4 rounded-sm border border-dashed border-amber-500/50 bg-amber-700/60" />
					<span>Introuvable</span>
				</div>
			</div>
		</div>
	);
}
