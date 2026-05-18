"use client";

import { useState } from "react";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import type { Task } from "@/types";

import { taskTypeConfig } from "@/utils/taskConfig";

interface Props {
	tasks: Task[];
}

export default function TasksCalendarCard({ tasks = [] }: Props) {
	const [month, setMonth] = useState(new Date());

	function getTasksForDay(date: Date) {
		return tasks.filter((task) => {
			if (!task.dueDate) return false;

			const taskDate = new Date(task.dueDate);

			return taskDate.toDateString() === date.toDateString();
		});
	}

	// ── tâches du mois affiché
	const monthTasks = tasks.filter((task) => {
		if (!task.dueDate) return false;

		const date = new Date(task.dueDate);

		return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
	});

	// ── counts dynamiques du mois affiché
	const counts = Object.keys(taskTypeConfig).reduce(
		(acc, type) => {
			acc[type] = monthTasks.filter((t) => t.type === type).length;

			return acc;
		},
		{} as Record<string, number>,
	);

	const totalTasks = monthTasks.length;

	return (
		<div className="rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-sm">
			<h2 className="mb-5 text-xl font-semibold">Calendrier</h2>

			<div className="grid justify-center gap-6">
				<DayPicker
					mode="single"
					month={month}
					onMonthChange={setMonth}
					classNames={{
						day_today: "text-emerald-400 font-bold",
					}}
					components={{
						DayButton: ({ day, children, ...props }) => {
							const dayTasks = getTasksForDay(day.date);

							return (
								<button {...props} className="relative h-10 w-10 rounded-xl text-white transition hover:bg-white/10">
									{children}

									{dayTasks.length > 0 && (
										<div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-end gap-0.5">
											{/* Points */}
											{dayTasks.slice(0, dayTasks.length > 3 ? 2 : 3).map((task, index) => (
												<div key={index} className={`h-1.5 w-1.5 rounded-full ${taskTypeConfig[task.type].dot}`} />
											))}

											{/* Counter */}
											{dayTasks.length > 3 && <span className="text-[9px] leading-none text-gray-400 translate-y-[1px]">+{dayTasks.length - 2}</span>}
										</div>
									)}
								</button>
							);
						},
					}}
				/>
			</div>

			{/* LEGEND */}
			<div className="mt-6 space-y-3 text-sm">
				{Object.entries(taskTypeConfig).map(([type, config]) => {
					const count = counts[type] ?? 0;

					if (count === 0) return null;

					return (
						<div key={type} className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className={`h-2 w-2 rounded-full ${config.dot}`} />

								<span>{config.label}</span>
							</div>

							<span className="text-gray-300">{count}</span>
						</div>
					);
				})}

				{/* TOTAL */}
				<div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-sm font-medium">
					<span className="text-gray-300">Total</span>

					<span className="text-white">{totalTasks}</span>
				</div>
			</div>
		</div>
	);
}
