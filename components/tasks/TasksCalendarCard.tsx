"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import type { Task } from "@/types";
import { taskTypeConfig } from "@/utils/taskConfig";

interface Props {
	tasks: Task[];
}

export default function TasksCalendarCard({ tasks = [] }: Props) {
	function getTasksForDay(date: Date) {
		return tasks.filter((task) => {
			if (!task.dueDate) return false;
			return new Date(task.dueDate).toDateString() === date.toDateString();
		});
	}

	const counts = Object.keys(taskTypeConfig).reduce(
		(acc, type) => {
			acc[type] = tasks.filter((t) => t.type === type).length;
			return acc;
		},
		{} as Record<string, number>,
	);

	return (
		<div className="rounded-2xl border border-white/10 bg-[#111827] shadow-sm p-5">
			<h2 className="text-xl font-semibold mb-5">Calendrier</h2>

			<div className="grid gap-6 justify-center">
				<DayPicker
					mode="single"
					components={{
						DayButton: ({ day, children, ...props }) => {
							const dayTasks = getTasksForDay(day.date);

							return (
								<button {...props} className="relative h-10 w-10 rounded-xl hover:bg-white/10 text-white transition">
									{children}

									{dayTasks.length > 0 && (
										<div className="absolute bottom-1 left-[21px] flex -translate-x-1/2 gap-0.5">
											{dayTasks.slice(0, 3).map((task, index) => (
												<div key={index} className={`h-1.5 w-1.5 rounded-full ${taskTypeConfig[task.type].dot}`} />
											))}
										</div>
									)}
								</button>
							);
						},
					}}
				/>
			</div>

			{/* LEGEND DYNAMIQUE */}
			<div className="mt-6 space-y-3 text-sm">
				{Object.entries(taskTypeConfig).map(([type, config]) => {
					const count = counts[type] ?? 0;

					if (count === 0) return null;

					return (
						<div key={type} className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className={`w-2 h-2 rounded-full ${config.dot}`} />
								<span>{config.label}</span>
							</div>

							<span>{count}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
