"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function TasksCalendarCard() {
	return (
		<div className="bg-white border rounded-2xl p-5 shadow-sm">
			<h2 className="text-xl font-semibold mb-5">Calendrier</h2>

			<DayPicker mode="single" />

			<div className="mt-6 space-y-3 text-sm">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-blue-500" />
						Ménage
					</div>

					<span>12</span>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-green-500" />
						Check-in
					</div>

					<span>8</span>
				</div>
			</div>
		</div>
	);
}
