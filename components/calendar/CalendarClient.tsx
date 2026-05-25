"use client";

import { useMemo, useState } from "react";
import type { Apartment } from "@/types";
import type { Reservation } from "@/types";

interface CalendarEvent {
	id: string;
	title: string;
	start: string | Date;
	end: string | Date;
	type: "reservation" | "ical";
	apartment: string | { _id: string; name: string };
}

interface Props {
	events: CalendarEvent[];
	apartments: Apartment[];
}

function getMonthDays(date: Date) {
	const year = date.getFullYear();
	const month = date.getMonth();
	const lastDay = new Date(year, month + 1, 0);

	const days: Date[] = [];

	for (let i = 1; i <= lastDay.getDate(); i++) {
		days.push(new Date(year, month, i));
	}

	return days;
}

export default function CalendarClient({ events, apartments }: Props) {
	const [currentDate, setCurrentDate] = useState(new Date());

	const [selectedApartments, setSelectedApartments] = useState<string[]>(apartments.map((a) => a._id));

	function toggleApartment(id: string) {
		setSelectedApartments((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
	}

	// ── FILTER EVENTS BY APARTMENT ─────────────────────────
	const filteredEvents = useMemo(() => {
		return events.filter((event) => {
			const apartmentId = typeof event.apartment === "object" ? event.apartment._id : apartments.find((a) => a.name === event.apartment)?._id;

			return apartmentId && selectedApartments.includes(apartmentId);
		});
	}, [events, selectedApartments, apartments]);

	// ── GROUP EVENTS BY DAY ─────────────────────────
	const grouped = useMemo(() => {
		const map: Record<string, CalendarEvent[]> = {};

		for (const event of filteredEvents) {
			const start = new Date(event.start);
			const end = new Date(event.end);

			let current = new Date(start);

			while (current <= end) {
				const key = current.toISOString().split("T")[0];

				if (!map[key]) map[key] = [];
				map[key].push(event);

				current.setDate(current.getDate() + 1);
			}
		}

		return map;
	}, [filteredEvents]);

	const days = useMemo(() => getMonthDays(currentDate), [currentDate]);

	function prevMonth() {
		setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
	}

	function nextMonth() {
		setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
	}

	return (
		<div className="space-y-6 text-white">
			{/* ── HEADER ───────────────────────── */}
			<div className="flex items-center justify-between">
				<button onClick={prevMonth} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">
					◀
				</button>

				<h2 className="text-xl font-bold capitalize">
					{currentDate.toLocaleDateString("fr-FR", {
						month: "long",
						year: "numeric",
					})}
				</h2>

				<button onClick={nextMonth} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">
					▶
				</button>
			</div>

			{/* ── APARTMENT FILTERS ───────────────────────── */}
			<div className="flex flex-wrap gap-2">
				{apartments.map((a) => (
					<button
						key={a._id}
						onClick={() => toggleApartment(a._id)}
						className={`px-3 py-1 text-xs rounded-full border transition ${
							selectedApartments.includes(a._id) ? "bg-blue-500 text-white border-blue-500" : "bg-transparent text-gray-400 border-white/20"
						}`}
					>
						{a.name}
					</button>
				))}
			</div>

			{/* ── WEEK HEADER ───────────────────────── */}
			<div className="grid grid-cols-7 text-xs text-gray-400 text-center">
				{["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
					<div key={d}>{d}</div>
				))}
			</div>

			{/* ── GRID ───────────────────────── */}
			<div className="grid grid-cols-7 gap-2">
				{days.map((day) => {
					const key = day.toISOString().split("T")[0];
					const dayEvents = grouped[key] || [];

					const isToday = new Date().toDateString() === day.toDateString();

					return (
						<div key={key} className={`min-h-[110px] p-2 border rounded-lg ${isToday ? "border-blue-500" : "border-white/10"}`}>
							<div className="text-xs text-gray-400">{day.getDate()}</div>

							<div className="mt-1 space-y-1">
								{dayEvents.map((e) => (
									<div key={e.id} className={`text-[10px] px-1 py-0.5 rounded truncate ${e.type === "reservation" ? "bg-green-500/20 text-green-300" : "bg-blue-500/20 text-blue-300"}`}>
										{e.title}
									</div>
								))}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
