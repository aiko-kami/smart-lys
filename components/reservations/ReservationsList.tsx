"use client";

import { useMemo, useState } from "react";

import type { Reservation } from "@/types";

interface Props {
	reservations: Reservation[];

	onReservationClick: (reservation: Reservation) => void;
}

export default function ReservationsList({ reservations, onReservationClick }: Props) {
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		return reservations.filter((reservation) => reservation.guestName?.toLowerCase().includes(search.toLowerCase()));
	}, [reservations, search]);

	return (
		<div className="rounded-2xl border border-white/10 bg-[#111827]">
			<div className="border-b border-white/10 p-5">
				<h2 className="text-xl font-semibold">Réservations</h2>

				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Rechercher..."
					className="mt-4 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white"
				/>
			</div>

			<div className="divide-y divide-white/10">
				{filtered.map((reservation) => (
					<button key={reservation._id} onClick={() => onReservationClick(reservation)} className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-white/5">
						<div>
							<p className="font-medium text-white">{reservation.guestName ?? "Voyageur"}</p>

							<p className="text-sm text-gray-400">{reservation.platform}</p>
						</div>

						<div className="text-sm text-gray-400">→</div>
					</button>
				))}
			</div>
		</div>
	);
}
