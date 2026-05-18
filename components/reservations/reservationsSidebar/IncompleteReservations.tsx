"use client";

import type { Reservation } from "@/types";

interface Props {
	reservations: Reservation[];
}

export default function IncompleteReservations({ reservations }: Props) {
	// TODO: vraie logique métier
	const incomplete: Reservation[] = [];

	return (
		<div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
			<h2 className="text-lg font-semibold">À compléter</h2>

			{incomplete.length > 0 ? <div className="mt-4">...</div> : <p className="mt-4 text-sm text-gray-500">Aucune réservation incomplète</p>}
		</div>
	);
}
