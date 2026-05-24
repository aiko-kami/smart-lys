import type { Reservation } from "@/types";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { ViewButton, EditButton } from "@/components/buttons/Buttons";

interface Props {
	selectedReservation: Reservation | null;
	onClose?: () => void;
	onShowDetails: (r: Reservation) => void;
	onModify: (r: Reservation) => void;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDate(d?: string | Date) {
	if (!d) return "—";
	return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(t?: string) {
	if (!t) return null;
	return t;
}

function nights(checkIn?: string | Date, checkOut?: string | Date) {
	if (!checkIn || !checkOut) return 0;
	return Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
}

const PLATFORM_LABEL: Record<string, { label: string; color: string; bg: string }> = {
	airbnb: { label: "Airbnb", color: "#FF5A5F", bg: "rgba(255,90,95,0.12)" },
	booking: { label: "Booking", color: "#003580", bg: "rgba(0,53,128,0.18)" },
	direct: { label: "Direct", color: "#1DBF8A", bg: "rgba(29,191,138,0.12)" },
	other: { label: "Autre", color: "#888", bg: "rgba(255,255,255,0.06)" },
};

const STATUS_META: Record<string, { label: string; color: string; bg: string; dot: string }> = {
	pending: { label: "En attente", color: "#D4934A", bg: "rgba(212,147,74,0.14)", dot: "#D4934A" },
	confirmed: { label: "Confirmée", color: "#9D91F5", bg: "rgba(157,145,245,0.14)", dot: "#7C6EE8" },
	cancelled: { label: "Annulée", color: "#E07070", bg: "rgba(224,112,112,0.14)", dot: "#C04040" },
	completed: { label: "Terminée", color: "#888", bg: "rgba(255,255,255,0.06)", dot: "#555" },
};

// ─── sub-components ───────────────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex items-start justify-between gap-3 py-2.5 border-b border-white/[0.05] last:border-0">
			<span className="shrink-0 text-[11px] uppercase tracking-wide text-gray-500">{label}</span>
			<div className="text-right text-sm text-gray-200">{children}</div>
		</div>
	);
}

function PlatformBadge({ platform }: { platform?: string }) {
	const meta = PLATFORM_LABEL[platform ?? "other"] ?? PLATFORM_LABEL.other;
	return (
		<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize" style={{ background: meta.bg, color: meta.color }}>
			{meta.label}
		</span>
	);
}

function StatusBadge({ status }: { status?: string }) {
	const meta = STATUS_META[status ?? "pending"] ?? STATUS_META.pending;
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: meta.bg, color: meta.color }}>
			<span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.dot }} />
			{meta.label}
		</span>
	);
}

// ─── empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
			<div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500">
					<rect x="3" y="4" width="18" height="18" rx="2" />
					<path d="M16 2v4M8 2v4M3 10h18" />
				</svg>
			</div>
			<p className="text-sm italic text-gray-500">Sélectionnez une réservation</p>
		</div>
	);
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function SelectedReservationCard({ selectedReservation: r, onClose, onShowDetails, onModify }: Props) {
	const n = r ? nights(r.checkIn, r.checkOut) : 0;
	const totalWithFees = r ? (r.totalAmount ?? 0) : 0;

	return (
		<>
			<div className={`flex flex-col rounded-2xl border overflow-hidden ${r ? "border-white/50 bg-[#1c273b]" : "border-white/10 bg-[#111827]"}`}>
				{/* header */}
				<div className="flex items-start justify-between border-b border-white/10 pl-5 pr-4 py-4">
					<h2 className="text-lg font-semibold text-white">Réservation sélectionnée</h2>

					{r && onClose && (
						<button
							onClick={onClose}
							className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
						>
							✕
						</button>
					)}
				</div>
				{!r ? (
					<EmptyState />
				) : (
					<>
						{/* guest block */}
						<div className="border-b border-white/[0.05] px-5 py-4">
							<div className="flex items-start justify-between gap-2">
								<div>
									<p className="text-base font-semibold text-white leading-tight">{r.guestName}</p>
									{r.guestEmail && <p className="mt-0.5 text-xs text-gray-500 truncate">{r.guestEmail}</p>}
									{r.guestPhone && <p className="mt-0.5 text-xs text-gray-500">{r.guestPhone}</p>}
								</div>
								<StatusBadge status={r.status} />
							</div>
							{r.isIncomplete && (
								<div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2">
									<span className="text-amber-400 text-xs">⚠</span>
									<span className="text-xs text-amber-300">Informations incomplètes</span>
								</div>
							)}

							{/* Apartment block */}
							<div className="mt-4 flex items-start justify-between gap-2">
								<div className="flex items-center gap-3">
									<img
										src={r.apartmentId.image}
										onError={(e) => {
											e.currentTarget.src = "/images/house-placeholder.jpg";
										}}
										className="h-14 w-14 shrink-0 rounded-lg object-cover"
										alt={r.apartmentId.name}
									/>
									<div>
										<div className="text-base font-semibold text-white leading-tight">{r.apartmentId.name}</div>
										<div className="mt-0.5 text-xs text-gray-500 truncate">{r.apartmentId.address}</div>
									</div>
								</div>
							</div>
						</div>

						{/* dates block */}
						<div className="border-b border-white/[0.05] px-5 py-3">
							<p className="mb-2 text-center text-sm text-gray-500">
								{n} nuit{n > 1 ? "s" : ""} · {r.guests ?? 1} voyageur{(r.guests ?? 1) > 1 ? "s" : ""}
							</p>

							<div className="grid grid-cols-1 gap-3 mb-2">
								<div className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-2.5">
									<p className="text-[10px] uppercase tracking-wide text-gray-600 mb-1">Arrivée</p>
									<div className="flex items-center justify-between pl-16 pr-2">
										<p className="text-sm font-medium text-white">{formatDate(r.checkIn)}</p>
										{formatTime(r.arrivalTime) && <p className="text-sm text-white mt-0.5">{r.arrivalTime}</p>}
									</div>
								</div>
								<div className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-2.5">
									<p className="text-[10px] uppercase tracking-wide text-gray-600 mb-1">Départ</p>
									<div className="flex items-center justify-between pl-16 pr-2">
										<p className="text-sm font-medium text-white">{formatDate(r.checkOut)}</p>
										{formatTime(r.departureTime) && <p className="text-sm text-white mt-0.5">{r.departureTime}</p>}
									</div>
								</div>
							</div>
						</div>

						{/* Details */}
						<div className="px-5 py-3">
							<Row label="Plateforme">{r.platform ? <PlatformIcon platform={r.platform} /> : "—"}</Row>
							<Row label="Montant">
								{r.totalAmount ? (
									<div className="flex items-baseline gap-1">
										<span className="font-medium text-white">{r.totalAmount}</span>
										<span className="text-[10px]">{r.currency ?? "€"}</span>
									</div>
								) : (
									"—"
								)}
							</Row>
						</div>

						{/* notes preview */}
						{r.notes && (
							<div className="mx-5 mb-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
								<p className="mb-1 text-[10px] uppercase tracking-wide text-gray-600">Notes</p>
								<p className="line-clamp-3 text-xs text-gray-400 leading-relaxed">{r.notes}</p>
							</div>
						)}

						{/* CTA */}
						<div className="border-t border-white/[0.05] flex justify-around gap-2 px-5 py-4">
							<ViewButton btnSize="sm" action={() => r && onShowDetails(r)} />
							<EditButton btnSize="sm" action={() => r && onModify(r)} />
						</div>
					</>
				)}
			</div>
		</>
	);
}
