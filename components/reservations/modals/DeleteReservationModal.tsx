"use client";

import { FaTriangleExclamation, FaXmark } from "react-icons/fa6";

import Modal from "@/components/ui/Modal";
import { DeleteReservationModalProps } from "@/types";

function formatDate(d?: string | Date) {
	if (!d) return "—";
	return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function DeleteReservationModal({ reservation, deleting, onConfirm, onClose }: DeleteReservationModalProps) {
	return (
		<Modal open={!!reservation} onClose={onClose}>
			<div className="w-full sm:max-w-md rounded-2xl bg-[#0F172A] p-6">
				{/* HEADER */}
				<div className="mb-5 flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
							<FaTriangleExclamation className="text-red-400" />
						</div>

						<h2 className="text-base font-semibold">Supprimer la réservation</h2>
					</div>

					<button onClick={onClose} className="rounded-lg border border-white/10 p-1.5 text-gray-400 hover:bg-white/10">
						<FaXmark size={16} />
					</button>
				</div>

				{/* INFO BOX */}
				<div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
					<h3 className="text-lg font-semibold mb-2">{reservation.guestName}</h3>
					<p className="text-sm">{reservation.apartmentId.name}</p>
					<p className="mt-0.5 text-xs text-gray-400">{reservation.apartmentId.address}</p>

					<div className="grid grid-cols-2 gap-2 mt-4">
						<div className="rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 py-2.5">
							<p className="text-[10px] text-gray-600 mb-1">Arrivée</p>
							<p className="text-sm font-medium text-white">{formatDate(reservation.checkIn)}</p>
							{reservation.arrivalTime && <p className="text-xs text-gray-500 mt-0.5">{reservation.arrivalTime}</p>}
						</div>
						<div className="rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 py-2.5">
							<p className="text-[10px] text-gray-600 mb-1">Départ</p>
							<p className="text-sm font-medium text-white">{formatDate(reservation.checkOut)}</p>
							{reservation.departureTime && <p className="text-xs text-gray-500 mt-0.5">{reservation.departureTime}</p>}
						</div>
					</div>
				</div>

				{/* WARNING */}
				<p className="mb-6 text-sm text-gray-400">
					Cette action est <span className="font-medium text-white">irréversible</span>. Toutes les données associées à cette réservation seront supprimées définitivement.
				</p>

				{/* ACTIONS */}
				<div className="flex gap-3">
					<button onClick={onClose} disabled={deleting} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-gray-300 hover:bg-white/10 disabled:opacity-50">
						Annuler
					</button>

					<button onClick={onConfirm} disabled={deleting} className="flex-1 rounded-xl bg-red-700 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50">
						{deleting ? "Suppression..." : "Supprimer"}
					</button>
				</div>
			</div>
		</Modal>
	);
}
