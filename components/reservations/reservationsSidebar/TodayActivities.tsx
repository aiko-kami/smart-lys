"use client";

import type { Reservation } from "@/types";

interface Props {
	reservations: Reservation[];
}

export default function TodayActivities({ reservations }: Props) {
	// TODO: filtre réel selon dates
	const todayReservations = [];

	return (
		<div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
			<h2 className="text-lg font-semibold">Aujourd’hui</h2>

			{todayReservations.length > 0 ? <div className="mt-4">...</div> : <p className="mt-4 text-sm text-gray-500">Aucune activité</p>}
		</div>
	);
}
