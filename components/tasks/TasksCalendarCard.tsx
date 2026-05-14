"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Event = {
	id: string;
	type: "cleaning" | "checkin" | "checkout";
	start: string; // ISO datetime
	end: string; // ISO datetime
};

const events: Event[] = [
	{
		id: "1",
		type: "checkin",
		start: "2026-05-11T10:00:00",
		end: "2026-05-12T14:00:00", // ends mid-day
	},
];

function normalize(date: Date) {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d.getTime();
}

function isSameDay(a: Date, b: Date) {
	return a.toDateString() === b.toDateString();
}

function getDayProgress(date: Date, event: Event) {
	const dayStart = new Date(date);
	dayStart.setHours(0, 0, 0, 0);

	const dayEnd = new Date(date);
	dayEnd.setHours(23, 59, 59, 999);

	const eventStart = new Date(event.start);
	const eventEnd = new Date(event.end);

	const start = Math.max(eventStart.getTime(), dayStart.getTime());
	const end = Math.min(eventEnd.getTime(), dayEnd.getTime());

	if (end <= start) return null;

	const total = dayEnd.getTime() - dayStart.getTime();
	const relativeStart = start - dayStart.getTime();
	const relativeEnd = end - dayStart.getTime();

	return {
		left: (relativeStart / total) * 100,
		width: ((relativeEnd - relativeStart) / total) * 100,
	};
}

function isInRange(date: Date, event: Event) {
	const d = normalize(date);
	const start = normalize(new Date(event.start));
	const end = normalize(new Date(event.end));

	return d >= start && d <= end;
}

function getRangePosition(date: Date, event: Event) {
	const d = normalize(date);
	const start = normalize(new Date(event.start));
	const end = normalize(new Date(event.end));

	if (d === start) return "start";
	if (d === end) return "end";
	return "middle";
}

type TaskType = "cleaning" | "checkin" | "checkout" | "maintenance";

const tasks: { date: string; type: TaskType }[] = [
	{
		date: "2026-05-10",
		type: "cleaning",
	},
	{
		date: "2026-05-10",
		type: "cleaning",
	},
	{
		date: "2026-05-10",
		type: "cleaning",
	},
	{
		date: "2026-05-12",
		type: "checkin",
	},
	{
		date: "2026-05-10",
		type: "maintenance",
	},
	{
		date: "2026-05-12",
		type: "checkout",
	},
];

const taskTypeColors: Record<TaskType, string> = {
	cleaning: "bg-blue-500",
	checkin: "bg-green-500",
	checkout: "bg-orange-500",
	maintenance: "bg-red-500",
};

export default function TasksCalendarCard() {
	function getTasksForDay(date: Date) {
		return tasks.filter((task) => new Date(task.date).toDateString() === date.toDateString());
	}

	return (
		<div className="rounded-2xl border border-white/10 bg-[#111827] shadow-sm p-5">
			<h2 className="text-xl font-semibold mb-5">Calendrier</h2>

			<div className="grid gap-6 justify-center">
				<DayPicker
					mode="single"
					components={{
						DayButton: ({ day, children, ...props }) => {
							const activeEvents = events.filter((e) => isInRange(day.date, e));

							return (
								<button {...props} className="relative h-10 w-10 text-white">
									{/* Background bar */}
									{activeEvents.length > 0 && (
										<div className="absolute inset-0">
											{activeEvents.map((event) => {
												const progress = getDayProgress(day.date, event);
												if (!progress) return null;

												return (
													<div
														key={event.id}
														className={`absolute top-1/2 h-2 -translate-y-1/2 rounded-full ${
															event.type === "cleaning" ? "bg-blue-500/30" : event.type === "checkin" ? "bg-green-500/30" : "bg-orange-500/30"
														}`}
														style={{
															left: `${progress.left}%`,
															width: `${progress.width}%`,
														}}
													/>
												);
											})}
										</div>
									)}

									{/* Day number */}
									<span className="relative z-10">{children}</span>
								</button>
							);
						},
					}}
				/>
				<DayPicker
					mode="single"
					classNames={{
						day_today: "text-emerald-400 font-bold",
					}}
					components={{
						DayButton: ({ day, children, ...props }) => {
							const dayTasks = getTasksForDay(day.date);

							return (
								<button {...props} className="relative h-10 w-10 rounded-xl hover:bg-white/10 text-white transition">
									{children}

									{dayTasks.length > 0 && (
										<div className="absolute bottom-1 left-[21px] flex -translate-x-1/2 gap-0.5">
											{dayTasks.slice(0, 3).map((task, index) => (
												<div key={index} className={`h-1.5 w-1.5 rounded-full ${taskTypeColors[task.type]}`} />
											))}
										</div>
									)}
								</button>
							);
						},
					}}
				/>
			</div>

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

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-orange-500" />
						Check-out
					</div>

					<span>5</span>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-red-500" />
						Maintenance
					</div>

					<span>2</span>
				</div>
			</div>
		</div>
	);
}
