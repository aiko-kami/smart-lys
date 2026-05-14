"use client";

import TaskItem from "./TaskItem";
import { formatTodayDate } from "@/utils/format";
import type { Task } from "@/types";

interface Props {
	tasks: Task[];
	onTaskClick: (task: Task) => void;
}

export default function TasksTodayCard({ tasks, onTaskClick }: Props) {
	return (
		<div className="rounded-2xl border border-white/10 bg-[#111827] shadow-sm">
			{/* HEADER */}
			<div className="flex items-center justify-between border-b border-white/10 p-5">
				<div>
					<h2 className="text-xl font-semibold">Tâches du jour</h2>

					<p className="mt-1 pl-1 text-sm font-semibold text-purple-200 text-muted-foreground">{formatTodayDate()}</p>
				</div>
			</div>

			{/* EMPTY */}
			{tasks.length === 0 ? (
				<div className="px-2 py-10 text-center text-gray-400">
					🌺 <span className="italic">Aucune tâche prévue aujourd’hui</span> 🌼
				</div>
			) : (
				/* TASKS */
				<div className="divide-y divide-white/10 p-3">
					{tasks.map((task) => (
						<div key={task._id}>
							<TaskItem task={task} onClick={() => onTaskClick(task)} />
						</div>
					))}
				</div>
			)}
		</div>
	);
}
