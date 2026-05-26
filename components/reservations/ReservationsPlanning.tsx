"use client";

import { useMemo, useState } from "react";
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

function colMinWidth(v: View) {
	if (v === "day") return 160;
	if (v === "week") return typeof window !== "undefined" && window.innerWidth > 1440 ? 90 : 110;
	if (v === "2weeks") return 80;
	return 52;
}

function getPlatformStyle(platform?: string) {
	const match = PLATFORMS.find((p) => p.value === platform);
	return {
		bg: match?.bg ?? "rgba(255,255,255,0.08)",
		color: match?.color ?? "#888",
		label: match?.label ?? "Autre",
	};
}

// Checkout day: banner covers only the first third (morning departure).
const CHECKOUT_FRACTION = 0.48;
// Checkin day:  banner starts at 45% into the column (just under half).
const CHECKIN_OFFSET = 0.52;

/**
 * For a given reservation and the visible day range, return:
 *   - colStart        : 0-based index of the first visible day of the stay
 *   - colSpan         : full night columns (checkIn ≤ d < checkOut)
 *   - checkoutInView  : whether the checkout day itself is visible in the grid
 *   - startsHere      : the checkIn day is inside the visible window
 *   - endsHere        : the last night (day before checkout) is inside the visible window
 *
 * The rendered width = colSpan full columns + CHECKOUT_FRACTION of one extra column
 * when checkoutInView is true.
 */
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
		// full-night columns: checkIn ≤ d < checkOut
		if (d >= checkIn && d < checkOut) {
			if (colStart === -1) colStart = i;
			colSpan++;
		}
	}

	// A reservation that only covers the checkout day (zero nights visible) is still
	// shown if the checkout day is in the window — as a small stub.
	const checkoutIdx = days.findIndex((d) => sameDay(d, checkOut));
	const checkoutInView = checkoutIdx >= 0;

	// Nothing to show at all
	if (colStart === -1 && !checkoutInView) return null;

	// Edge case: reservation ends before the window starts — only checkout day visible
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

// ─── day header cell ──────────────────────────────────────────────────────────

function DayHeader({ day, view, isToday }: { day: Date; view: View; isToday: boolean }) {
	const label =
		view === "month"
			? day.toLocaleDateString("fr-FR", { day: "2-digit" })
			: view === "2weeks"
				? day.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit" })
				: day.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short" });

	return (
		<div
			className={`flex flex-col items-center justify-center py-2 text-center text-[11px] font-medium
				${isToday ? "!text-violet-400 font-semibold" : ""}
			`}
		>
			{view === "month" ? (
				<span>{label}</span>
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
	onReservationClick,
	onReservationDoubleClick,
}: {
	apartment: Apartment;
	days: Date[];
	reservations: Reservation[];
	view: View;
	today: Date;
	onReservationClick: (r: Reservation) => void;
	onReservationDoubleClick: (r: Reservation) => void;
}) {
	const N = days.length;

	// filter reservations that overlap the window
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
			{/* apartment label */}
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

			{/* grid */}
			<div
				className="relative min-h-[52px] flex-1 bg-[#0F1117]"
				style={{
					display: "grid",
					gridTemplateColumns: `repeat(${N}, minmax(${colMinWidth(view)}px, 1fr))`,
				}}
			>
				{/* background cells */}
				{days.map((d, i) => (
					<div key={isoDate(d)} className={`border-r border-white/20 ${sameDay(d, today) ? "bg-violet-500/[0.04]" : ""}`} />
				))}

				{/* today vertical highlight */}
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
				{spans.map(({ r, colStart, colSpan, checkoutInView, startsHere, endsHere, startsBeforeView, endsAfterView }) => {
					// Checkin starts at the last third of its column (afternoon arrival)
					const checkinShift = startsHere ? CHECKIN_OFFSET : 0;

					// Effective columns:
					//   subtract the 2/3 we skip on the checkin column
					//   add 1/3 for the checkout morning stub (if visible)
					const effectiveCols = colSpan - checkinShift + (checkoutInView ? CHECKOUT_FRACTION : 0);

					const GAP = 2;
					const left = `calc(${((colStart + checkinShift) / N) * 100}% + ${GAP}px)`;
					const width = `calc(${(effectiveCols / N) * 100}% - ${GAP * 2}px)`;

					const incomplete = !r.guestName || !r.totalAmount;
					const platformStyle = getPlatformStyle(r.platform);

					return (
						<button
							key={r._id}
							onClick={() => onReservationClick(r)}
							onDoubleClick={() => onReservationDoubleClick(r)}
							title={r.guestName ?? "À compléter"}
							style={{ left, width, backgroundColor: platformStyle.bg }}
							className={`group absolute inset-y-[7px] z-20 flex items-center overflow-hidden px-2.5 text-left transition-opacity hover:opacity-80
	${startsBeforeView ? "rounded-l-none border-l-0" : "rounded-l-md"}
${endsAfterView ? "rounded-r-none border-r-0" : "rounded-r-md"}
	border border-white/20
		${incomplete ? "border border-amber-500/50 bg-amber-700/90 text-amber-100" : "border border-violet-500/50 bg-violet-700/90 text-violet-200"}
	`}
						>
							{/* LEFT */}
							<div className="flex items-center gap-1.5 min-w-0 flex-1">
								{incomplete && (
									<span className="shrink-0 text-[14px] text-amber-400" title="Réservation incomplète">
										⚠
									</span>
								)}

								<span className="truncate text-[11px] font-medium">{r.guestName ?? "À compléter"}</span>
							</div>

							{/* RIGHT */}
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
	const [offset, setOffset] = useState(0); // in units of viewLength

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
			return first.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
		}
		const sameMonth = first.getMonth() === last.getMonth();
		if (sameMonth) {
			return first.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
		}
		return `${first.toLocaleDateString("fr-FR", { month: "short" })} – ${last.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`;
	}, [days, view]);

	return (
		<div className="flex flex-col rounded-2xl border border-white/10 bg-[#111827] overflow-hidden">
			{/* ── TOOLBAR ── */}
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 px-5 py-3">
				{/* left: nav */}
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

				{/* right: view switcher */}
				<div className="flex gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
					{(Object.keys(VIEW_LABELS) as View[]).map((v) => (
						<button
							key={v}
							onClick={() => {
								setView(v);
								setOffset(0);
							}}
							className={`rounded-lg px-3 py-1.5 text-xs transition ${view === v ? "bg-white/10 text-white font-medium" : "text-gray-500 hover:text-gray-300"}`}
						>
							{VIEW_LABELS[v]}
						</button>
					))}
				</div>
			</div>

			{/* ── GRID ── */}
			<div className="overflow-x-auto">
				<div style={{ minWidth: 180 + viewLength(view) * colMinWidth(view) }}>
					{/* header row */}
					<div className="sticky top-0 z-30 flex border-b border-white/20 bg-[#111827]">
						{/* label spacer */}
						<div className="sticky left-0 z-40 w-[180px] shrink-0 border-r border-white/20 bg-[#111827] px-3 py-2 text-[10px] uppercase tracking-widest text-gray-600">Logement</div>
						{/* day headers */}
						<div
							className="flex-1"
							style={{
								display: "grid",
								gridTemplateColumns: `repeat(${days.length}, minmax(${colMinWidth(view)}px, 1fr))`,
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
							reservations={reservations.filter((r) => String(r.apartmentId._id) === apt._id)}
							view={view}
							today={today}
							onReservationClick={onReservationClick}
							onReservationDoubleClick={onReservationDoubleClick}
						/>
					))}
				</div>
			</div>
			{/* LEGEND */}
			<div className="sticky bottom-0 z-30 flex flex-wrap gap-3 border-t border-white/10 px-4 py-3 text-[11px] text-gray-300">
				{PLATFORMS.map((p) => (
					<div key={p.value} className="flex items-center gap-1.5">
						<span className="h-4 w-5 rounded-sm" style={{ background: p.bg }} />
						<span>{p.label}</span>
					</div>
				))}
			</div>
		</div>
	);
}
