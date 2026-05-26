"use client";

import type { Reservation, Apartment } from "@/types";
import { FaArrowRotateRight } from "react-icons/fa6";
import { useMemo } from "react";
import { formatTimeAgo } from "@/utils/format";

interface Props {
	reservations: Reservation[];
	apartments: Apartment[];
	onNewReservation: () => void;
	onImportIcal: () => void;
	onSyncIcal: () => void;
	syncing: boolean;
	sync: any;
}

function formatDate(date: Date | string) {
	return new Date(date).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "short",
	});
}

function splitOccupiedNights(reservations: Reservation[], filterFn: (date: Date) => boolean) {
	let occupied = 0;

	for (const r of reservations) {
		if (!r.checkIn || !r.checkOut) continue;

		const start = new Date(r.checkIn);
		const end = new Date(r.checkOut);

		if (isNaN(start.getTime()) || isNaN(end.getTime())) continue;

		const cursor = new Date(start);

		while (cursor < end) {
			if (filterFn(cursor)) {
				occupied++;
			}

			cursor.setDate(cursor.getDate() + 1);
		}
	}

	return occupied;
}

function getMonthOccupation(reservations: Reservation[], apartmentsCount: number, year: number, month: number) {
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	const occupied = splitOccupiedNights(reservations, (date) => {
		return date.getFullYear() === year && date.getMonth() === month;
	});

	const totalAvailable = daysInMonth * Math.max(apartmentsCount, 1);

	const rate = totalAvailable ? Math.round((occupied / totalAvailable) * 100) : 0;

	return {
		occupied,
		totalAvailable,
		daysInMonth,
		nbApartments: apartmentsCount,
		rate,
		label: `${rate}% ce mois-ci`,
	};
}

function getGlobalOccupation(reservations: Reservation[], apartmentsCount: number) {
	const occupied = splitOccupiedNights(reservations, () => true);

	const rate = apartmentsCount > 0 ? Math.round((occupied / (apartmentsCount * 365)) * 100) : 0;

	return {
		occupied,
		rate,
		label: `${occupied} nuits (global)`,
	};
}

function getMonthRevenue(reservations: Reservation[], year: number, month: number) {
	let revenue = 0;

	for (const r of reservations) {
		if (!r.checkIn || !r.checkOut) continue;

		const start = new Date(r.checkIn);
		const end = new Date(r.checkOut);

		const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

		const pricePerNight = (r.totalAmount || 0) / nights;

		const cursor = new Date(start);

		while (cursor < end) {
			if (cursor.getFullYear() === year && cursor.getMonth() === month) {
				revenue += pricePerNight;
			}
			cursor.setDate(cursor.getDate() + 1);
		}
	}

	return Math.round(revenue);
}

export default function ReservationsHeader({ reservations, apartments, onNewReservation, onImportIcal, onSyncIcal, syncing, sync }: Props) {
	const stats = useMemo(() => {
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth();

		const activeReservations = reservations.filter((r) => {
			const inDate = new Date(r.checkIn);
			const outDate = new Date(r.checkOut);
			return inDate <= now && outDate >= now;
		});

		const arrivalsToday = reservations.filter((r) => new Date(r.checkIn).toDateString() === now.toDateString());

		const departuresToday = reservations.filter((r) => new Date(r.checkOut).toDateString() === now.toDateString());

		const totalNights = reservations.reduce((a, r) => a + (r.nights || 0), 0);

		const totalRevenue = reservations.reduce((a, r) => a + (r.totalAmount || 0), 0);
		const monthRevenue = getMonthRevenue(reservations, year, month);

		const globalStats = getGlobalOccupation(reservations, apartments.length);
		const monthStats = getMonthOccupation(reservations, apartments.length, year, month);

		return {
			activeReservations,
			arrivalsToday,
			departuresToday,
			totalNights,
			totalRevenue,
			monthRevenue,
			monthStats,
			globalStats,
		};
	}, [reservations, apartments]);

	const cards = [
		{
			label: "En cours",
			value: stats.activeReservations.length,
			color: "text-blue-400",
			detail: stats.activeReservations[0]
				? `${stats.activeReservations[0].guestName} · ${formatDate(stats.activeReservations[0].checkIn)} → ${formatDate(stats.activeReservations[0].checkOut)}`
				: "Aucun séjour en cours",
		},
		{
			label: "Arrivées",
			value: stats.arrivalsToday.length,
			color: "text-emerald-400",
			detail: stats.arrivalsToday[0] ? `${stats.arrivalsToday[0].guestName} · arrivée ${formatDate(stats.arrivalsToday[0].checkIn)}` : "Aucune arrivée aujourd’hui",
		},
		{
			label: "Départs",
			value: stats.departuresToday.length,
			color: "text-orange-400",
			detail: stats.departuresToday[0] ? `${stats.departuresToday[0].guestName} · départ ${formatDate(stats.departuresToday[0].checkOut)}` : "Aucun départ aujourd’hui",
		},
		{
			label: "Nombre de nuits",
			value: stats.totalNights,
			color: "text-violet-400",
			detail: `${stats.monthStats.occupied} nuits ce mois`,
		},
		{
			label: "Taux d'occupation",
			value: `${stats.globalStats.rate}%`,
			color: "text-indigo-400",
			detail: stats.monthStats.label,
		},

		{
			label: "Revenus",
			value: `${stats.totalRevenue.toLocaleString("fr-FR")}€`,
			color: "text-yellow-400",
			detail: `${stats.monthRevenue.toLocaleString("fr-FR")}€ ce mois`,
		},
	];

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold">Réservations</h1>
					<p className="mt-1 text-sm text-gray-400">
						{reservations.length} réservation
						{reservations.length > 1 ? "s" : ""}
					</p>
				</div>

				<div>
					<div className="flex flex-wrap gap-2">
						<button onClick={onSyncIcal} disabled={syncing} className="rounded-xl border border-white/10 bg-[#111827] px-4 py-2 text-sm text-white hover:bg-white/10 disabled:opacity-50">
							<div className="flex items-center gap-2">
								{syncing ? "Synchronisation..." : "Synchroniser Airbnb"}
								<FaArrowRotateRight className={`shrink-0 ${syncing ? "animate-spin" : ""}`} />
							</div>
						</button>

						<button onClick={onImportIcal} className="rounded-xl border border-white/10 bg-[#111827] px-4 py-2 text-sm text-white hover:bg-white/10">
							Importer iCal
						</button>

						<button onClick={onNewReservation} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
							+ Nouvelle réservation
						</button>
					</div>
					<p className="mt-1 px-1 text-[11px] italic text-gray-500 ml-5">
						Dernière sync <span className="text-gray-400">{formatTimeAgo(sync?.lastAirbnbSyncAt)}</span>
					</p>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
				{cards.map((card) => (
					<div key={card.label} className="rounded-2xl border border-white/10 bg-[#111827] p-4">
						<p className="text-xs uppercase text-gray-500">{card.label}</p>
						<p className={`mt-2 text-2xl font-bold ${card.color}`}>{card.value}</p>
						<p className="mt-2 text-xs text-gray-400">{card.detail}</p>
					</div>
				))}
			</div>
		</div>
	);
}
