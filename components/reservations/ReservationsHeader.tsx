"use client";

import type { Reservation } from "@/types";

interface Props {
	reservations: Reservation[];

	onNewReservation: () => void;
	onImportIcal: () => void;
}

export default function ReservationsHeader({ reservations, onNewReservation, onImportIcal }: Props) {
	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold">Réservations</h1>

					<p className="mt-1 text-sm text-gray-400">{reservations.length} réservation(s)</p>
				</div>

				<div className="flex flex-wrap gap-2">
					<button className="rounded-xl border border-white/10 bg-[#111827] px-4 py-2 text-sm text-white hover:bg-white/10">Sync</button>

					<button onClick={onImportIcal} className="rounded-xl border border-white/10 bg-[#111827] px-4 py-2 text-sm text-white hover:bg-white/10">
						Importer iCal
					</button>

					<button onClick={onNewReservation} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
						+ Nouvelle réservation
					</button>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
				{["En cours", "Arrivées", "Départs", "Nuits", "Occupation", "Revenus"].map((label) => (
					<div key={label} className="rounded-2xl border border-white/10 bg-[#111827] p-4">
						<p className="text-xs uppercase text-gray-500">{label}</p>

						<p className="mt-2 text-2xl font-bold text-white">--</p>
					</div>
				))}
			</div>
		</div>
	);
}
