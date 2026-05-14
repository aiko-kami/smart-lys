"use client";

import TaskItem from "./TaskItem";
import type { Task } from "@/types";

interface Props {
	tasks: Task[];
	onTaskClick: (task: Task) => void;
}

export default function UpcomingTasksCard({ tasks, onTaskClick }: Props) {
	return (
		<div className="rounded-2xl border border-white/10 bg-[#111827] shadow-sm">
			{/* HEADER */}
			<div className="flex items-center justify-between border-b border-white/10 p-5">
				<div>
					<h2 className="text-xl font-semibold">Tâches à venir</h2>
				</div>
			</div>

			{/* EMPTY */}
			{tasks.length === 0 ? (
				<div className="px-2 py-10 text-center text-gray-400">
					🌺 <span className="italic">Aucune tâche prévue à venir</span> 🌼
				</div>
			) : (
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
