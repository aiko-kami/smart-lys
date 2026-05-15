"use client";

import TaskItem from "./TaskItem";
import type { Task } from "@/types";

interface Props {
	tasks: Task[];
	onTaskClick: (task: Task) => void;
}

export default function OtherTasksCard({ tasks, onTaskClick }: Props) {
	return (
		<div className="rounded-2xl border border-white/10 bg-[#111827] shadow-sm">
			{/* HEADER */}
			<div className="flex items-center justify-between border-b border-white/10 p-5">
				<div>
					<h2 className="text-xl font-semibold">Autres tâches</h2>
				</div>

				{/* COUNT */}
				<div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-gray-300">
					{tasks.length} tâche{tasks.length > 1 ? "s" : ""}
				</div>
			</div>

			{/* EMPTY */}
			{tasks.length === 0 ? (
				<div className="px-2 py-10 text-center text-gray-400">
					🌺 <span className="italic">Aucune autre tâche</span> 🌼
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
