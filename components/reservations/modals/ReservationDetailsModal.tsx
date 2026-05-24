"use client";

import { useEffect } from "react";
import type { Reservation } from "@/types";
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

const PLATFORM_LABEL: Record<string, { label: string; color: string; bg: string }> = {
	airbnb: { label: "Airbnb", color: "#FF5A5F", bg: "rgba(255,90,95,0.12)" },
	booking: { label: "Booking", color: "#5B9EE0", bg: "rgba(91,158,224,0.14)" },
	direct: { label: "Direct", color: "#1DBF8A", bg: "rgba(29,191,138,0.12)" },
	other: { label: "Autre", color: "#888", bg: "rgba(255,255,255,0.06)" },
};

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

	const platform = PLATFORM_LABEL[r.platform ?? "other"] ?? PLATFORM_LABEL.other;
	const status = STATUS_META[r.status ?? "pending"] ?? STATUS_META.pending;
	const nights = Math.round((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / 86400000);
	const total = r.totalAmount ?? 0;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
			<div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-2xl" onClick={(e) => e.stopPropagation()}>
				{/* accent bar */}
				<div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PLATFORMS.find((p) => p.value === r.platform)?.color || "#7288AE"}, transparent)` }} />

				{/* header */}
				<div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
					<div>
						<h2 className="text-xl font-semibold text-white">{r.guestName}</h2>
						{r.guestEmail && <p className="mt-0.5 text-sm text-gray-500">{r.guestEmail}</p>}
						<div className="flex flex-wrap items-center gap-2 mt-3">
							<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: platform.bg, color: platform.color }}>
								{platform.label}
							</span>
							<span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: status.bg, color: status.color }}>
								<span className="h-1.5 w-1.5 rounded-full" style={{ background: status.dot }} />
								{status.label}
							</span>
							{r.isImported && <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-gray-500">⟳ iCal</span>}
							{r.isIncomplete && <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-400">⚠ Incomplet</span>}
						</div>
					</div>
					<button onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-gray-500 transition hover:bg-white/5 hover:text-gray-300">
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
							<path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
						</svg>
					</button>
				</div>

				{/* body */}
				<div className="grid grid-cols-1 gap-5 px-6 py-5 sm:grid-cols-2">
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
						<p className="mb-4 text-center text-xs text-gray-600">
							{nights} nuit{nights > 1 ? "s" : ""} · {r.guests ?? 1} voyageur{(r.guests ?? 1) > 1 ? "s" : ""}
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
							<InfoRow label="Montant">{r.totalAmount ? `${r.totalAmount} ${r.currency ?? "EUR"}` : "—"}</InfoRow>
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
				<div className="flex justify-end gap-3 border-t border-white/5 px-6 py-4">
					{onDelete && <RemoveButton action={() => onDelete(r)} />}
					{onEdit && <EditButton action={() => onEdit(r)} />}
					<CloseButton action={() => onClose()} />
				</div>
			</div>
		</div>
	);
}
