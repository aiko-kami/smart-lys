"use client";

import type { Reservation } from "@/types";

interface Props {
	selectedReservation: Reservation | null;
}

export default function SelectedReservationCard({ selectedReservation }: Props) {
	return (
		<div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
			<h2 className="text-lg font-semibold">Réservation</h2>

			{selectedReservation ? (
				<div className="mt-4 space-y-2">
					<p className="font-medium text-white">{selectedReservation.guestName}</p>
					<p className="text-sm text-gray-400">{selectedReservation.platform}</p>
				</div>
			) : (
				<p className="mt-4 text-sm text-gray-500">Aucune réservation sélectionnée</p>
			)}
		</div>
	);
}
