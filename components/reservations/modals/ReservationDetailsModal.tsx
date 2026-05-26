"use client";

import { useEffect } from "react";
import { FaMoon, FaUsers } from "react-icons/fa6";
import type { Reservation } from "@/types";
import Modal from "@/components/ui/Modal";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { PLATFORMS } from "@/utils/constants";
import { EditButton, RemoveButton, CloseButton } from "@/components/buttons/Buttons";

interface Props {
	reservation: Reservation;
	onClose: () => void;
	onEdit?: (r: Reservation) => void;
	onDelete?: (r: Reservation) => void;
}

// ─── helpers (same as card) ───────────────────────────────────────────────────

function formatDate(d?: string | Date) {
	if (!d) return "—";
	return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatDateTime(d?: string | Date) {
	if (!d) return "—";
	return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const STATUS_META: Record<string, { label: string; color: string; bg: string; dot: string }> = {
	pending: { label: "En attente", color: "#D4934A", bg: "rgba(212,147,74,0.14)", dot: "#D4934A" },
	confirmed: { label: "Confirmée", color: "#9D91F5", bg: "rgba(157,145,245,0.14)", dot: "#7C6EE8" },
	cancelled: { label: "Annulée", color: "#E07070", bg: "rgba(224,112,112,0.14)", dot: "#C04040" },
	completed: { label: "Terminée", color: "#888", bg: "rgba(255,255,255,0.06)", dot: "#555" },
};

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex items-start justify-between gap-4 border-b border-white/[0.05] py-2.5 last:border-0">
			<span className="shrink-0 text-[11px] uppercase tracking-wide text-gray-500">{label}</span>
			<div className="text-right text-sm text-gray-200">{children}</div>
		</div>
	);
}

// ─── modal ────────────────────────────────────────────────────────────────────

export default function ReservationDetailsModal({ reservation: r, onClose, onEdit, onDelete }: Props) {
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);

	if (!r) return null;

	const status = STATUS_META[r.status ?? "pending"] ?? STATUS_META.pending;
	const nights = Math.round((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / 86400000);

	const apartment = typeof r.apartmentId === "object" && r.apartmentId !== null ? (r.apartmentId as any) : null;
	const client = typeof apartment?.clientId === "object" ? apartment.clientId : null;

	return (
		<Modal open={true} onClose={onClose} closeOnBackdrop={true}>
			<div className="w-full overflow-hidden rounded-2xl bg-[#0F172A]" onClick={(e) => e.stopPropagation()}>
				{/* accent bar */}
				<div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PLATFORMS.find((p) => p.value === r.platform)?.color || "#7288AE"}, transparent)` }} />

				{/* header */}
				<div className="border-b border-white/10 px-6 pt-5">
					<div className="flex items-start justify-between gap-4">
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-3">
								<h2 className="truncate text-2xl font-semibold text-white">{r.guestName}</h2>
							</div>

							{r.guestEmail && <p className="mt-1 text-sm text-gray-500">{r.guestEmail}</p>}
						</div>

						<button onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-gray-500 transition hover:bg-white/5 hover:text-gray-300">
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
								<path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
							</svg>
						</button>
					</div>
					{/* infos principales */}
					<div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
						<div className="flex h-20 flex-col rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
							<p className="text-[10px] mb-1.5 uppercase tracking-widest text-gray-600">Plateforme</p>

							<div className="flex flex-1 items-center justify-center">
								<PlatformIcon platform={r.platform} />
							</div>
						</div>

						<div className="flex h-20 flex-col rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
							<p className="text-[10px] mb-1.5 uppercase tracking-widest text-gray-600">Appartement</p>

							<div className="flex flex-1 items-center justify-center gap-2">
								<img
									src={apartment?.image || "/images/house-placeholder.jpg"}
									alt={apartment?.name ?? "Appartement"}
									className="h-8 w-8 shrink-0 rounded-lg object-cover"
									onError={(e) => {
										e.currentTarget.src = "/images/house-placeholder.jpg";
									}}
								/>

								<p className="truncate text-sm font-medium text-white">{apartment?.name ?? "—"}</p>
							</div>
						</div>

						<div className="flex h-20 flex-col rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
							<p className="text-[10px] mb-1.5 uppercase tracking-widest text-gray-600">Client</p>

							<div className="flex flex-1 items-center justify-center">
								<p className="truncate text-sm font-medium text-white">{client?.name ?? "—"}</p>
							</div>
						</div>

						<div className="flex h-20 flex-col rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
							<p className="text-[10px] mb-1.5 uppercase tracking-widest text-gray-600">Statut</p>

							<div className="flex flex-1 items-center justify-center">
								<div
									className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
									style={{
										background: status.bg,
										color: status.color,
									}}
								>
									<span className="h-1.5 w-1.5 rounded-full" style={{ background: status.dot }} />

									{status.label}
								</div>
							</div>
						</div>
					</div>

					{/* tags secondaires */}
					<div className="mt-4 mb-6 flex flex-wrap items-center gap-2">
						{r.isImported && <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-gray-500">⟳ Synchronisé iCal</span>}

						{r.isIncomplete && <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-400">⚠ Réservation incomplète</span>}
					</div>
				</div>

				{/* body */}
				<div className="grid grid-cols-1 gap-5 px-6 py-6 sm:grid-cols-2">
					{/* left col */}
					<div>
						{/* dates */}
						<p className="mb-2 text-[10px] uppercase tracking-widest text-gray-600">Séjour</p>
						<div className="grid grid-cols-2 gap-2 mb-4">
							<div className="rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 py-2.5">
								<p className="text-[10px] text-gray-600 mb-1">Arrivée</p>
								<p className="text-sm font-medium text-white">{formatDate(r.checkIn)}</p>
								{r.arrivalTime && <p className="text-xs text-gray-500 mt-0.5">{r.arrivalTime}</p>}
							</div>
							<div className="rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 py-2.5">
								<p className="text-[10px] text-gray-600 mb-1">Départ</p>
								<p className="text-sm font-medium text-white">{formatDate(r.checkOut)}</p>
								{r.departureTime && <p className="text-xs text-gray-500 mt-0.5">{r.departureTime}</p>}
							</div>
						</div>
						<p className="mb-4 flex items-center justify-center gap-4 text-sm text-gray-500">
							<span className="flex items-center gap-1">
								<FaMoon className="text-gray-400" size={12} />
								{nights} nuit{nights > 1 ? "s" : ""}
							</span>

							<span className="text-gray-700">·</span>

							<span className="flex items-center gap-1">
								<FaUsers className="text-gray-400" size={12} />
								{r.guests ?? 1} voyageur{(r.guests ?? 1) > 1 ? "s" : ""}
							</span>
						</p>

						{/* contact */}
						<p className="mb-2 text-[10px] uppercase tracking-widest text-gray-600">Contact</p>
						<div className="space-y-0">
							<InfoRow label="Tél.">{r.guestPhone || "—"}</InfoRow>
							<InfoRow label="Email">{r.guestEmail || "—"}</InfoRow>
						</div>
					</div>

					{/* right col */}
					<div>
						{/* financials */}
						<p className="mb-2 text-[10px] uppercase tracking-widest text-gray-600">Finances</p>
						<div className="space-y-0 mb-4">
							<InfoRow label="Montant">
								{r.totalAmount ? (
									<div className="flex items-baseline gap-1">
										<span className="font-medium text-white">{r.totalAmount}</span>
										<span className="text-[10px]">{r.currency ?? "€"}</span>
									</div>
								) : (
									"—"
								)}
							</InfoRow>
						</div>

						{/* meta */}
						<p className="mb-2 text-[10px] uppercase tracking-widest text-gray-600">Métadonnées</p>
						<div className="space-y-0">
							{r.externalId && <InfoRow label="Réf. externe">{r.externalId}</InfoRow>}
							{r.icalUid && (
								<InfoRow label="iCal UID">
									<span className="truncate text-xs text-gray-500 max-w-[120px] block">{r.icalUid}</span>
								</InfoRow>
							)}
							<InfoRow label="Créée le">{formatDateTime(r.createdAt)}</InfoRow>
							{r.lastSyncAt && <InfoRow label="Sync iCal">{formatDateTime(r.lastSyncAt)}</InfoRow>}
						</div>
					</div>
				</div>

				{/* notes */}
				{r.notes && (
					<div className="mx-6 mb-5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
						<p className="mb-1.5 text-[10px] uppercase tracking-widest text-gray-600">Notes</p>
						<p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{r.notes}</p>
					</div>
				)}

				{/* FOOTER */}
				<div className="flex justify-end gap-3 border-t border-white/5 px-6 py-5">
					{onDelete && <RemoveButton action={() => onDelete(r)} />}
					{onEdit && <EditButton action={() => onEdit(r)} />}
					<CloseButton action={() => onClose()} />
				</div>
			</div>
		</Modal>
	);
}
