"use client";

import { useMemo, useState } from "react";
import type { Apartment, Reservation } from "@/types";

interface Props {
	reservations: Reservation[];
	apartments: Apartment[];
	onReservationClick: (reservation: Reservation) => void;
}

function startOfToday() {
	const d = new Date();
	d.setHours(0, 0, 0, 0);
	return d;
}

function addDays(date: Date, days: number) {
	const d = new Date(date);
	d.setDate(d.getDate() + days);
	return d;
}

function formatDay(d: Date) {
	return d.toLocaleDateString("fr-FR", {
		weekday: "short",
		day: "2-digit",
	});
}

function isInRange(day: Date, start: Date, end: Date) {
	return day >= start && day <= end;
}

export default function ReservationsPlanning({ reservations = [], apartments = [], onReservationClick }: Props) {
	const [view] = useState<"day" | "week" | "month">("week");

	// 📅 7 jours (semaine)
	const days = useMemo(() => {
		const start = startOfToday();
		return Array.from({ length: 7 }, (_, i) => addDays(start, i));
	}, []);

	// 📌 index reservations par apartment + jour
	const matrix = useMemo(() => {
		const map: Record<string, Record<string, Reservation[]>> = {};

		for (const apartment of apartments) {
			map[apartment._id] = {};

			for (const day of days) {
				const key = day.toISOString().split("T")[0];

				map[apartment._id][key] = reservations.filter((r) => {
					const checkIn = new Date(r.checkIn);
					const checkOut = new Date(r.checkOut);

					return String(r.apartmentId) === apartment._id && isInRange(day, checkIn, checkOut);
				});
			}
		}

		return map;
	}, [reservations, apartments, days]);

	return (
		<div className="rounded-2xl border border-white/10 bg-[#111827]">
			{/* HEADER */}
			<div className="flex items-center justify-between border-b border-white/10 p-5">
				<h2 className="text-xl font-semibold">Planning</h2>

				<div className="text-sm text-gray-400">Semaine en cours</div>
			</div>

			{/* TABLE */}
			<div className="overflow-x-auto">
				<div className="min-w-[900px]">
					{/* HEADER ROW */}
					<div className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-white/10 bg-black/20">
						<div className="p-3 text-xs text-gray-400">Logements</div>

						{days.map((day) => (
							<div key={day.toISOString()} className="p-3 text-center text-xs text-gray-400">
								{formatDay(day)}
							</div>
						))}
					</div>

					{/* ROWS */}
					{apartments.map((apartment) => (
						<div key={apartment._id} className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-white/10">
							{/* APARTMENT CELL */}
							<div className="flex items-center gap-3 p-3">
								<img
									src={
										apartment.image ||
										"https://www.thespruce.com/thmb/nwyp8faCKNudvl1OBdmC3g7i9Vw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc()/PAinteriors-7-cafe9c2bd6be4823b9345e591e4f367f.jpg"
									}
									className="h-10 w-10 rounded-lg object-cover"
									alt={apartment.name}
								/>
								<span className="text-sm font-medium text-white">{apartment.name}</span>
							</div>

							{/* DAYS */}
							{days.map((day) => {
								const key = day.toISOString().split("T")[0];

								const cellReservations = matrix[apartment._id]?.[key] || [];

								return (
									<div key={key} className="min-h-[60px] border-l border-white/5 p-1">
										{cellReservations.map((r) => (
											<button key={r._id} onClick={() => onReservationClick(r)} className="w-full rounded-md bg-violet-500/10 px-2 py-1 text-left text-[11px] text-violet-200 hover:bg-violet-500/20">
												{r.guestName}
											</button>
										))}
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
