"use client";

import { useState } from "react";
import TaskItem from "./TaskItem";
import type { Task } from "@/types";
import TaskDetailsModal from "./TaskDetailsModal";

export default function OtherTasksCard({ tasks, onTaskClick }: { tasks: Task[]; onTaskClick: (task: Task) => void }) {
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);

	function handleEdit(task: Task) {
		console.log("Edit task:", task);

		// TODO:
		// open edit modal
		// or redirect
	}

	function handleDelete(task: Task) {
		console.log("Delete task:", task);

		// TODO:
		// open delete modal
		// or call delete API
	}

	return (
		<div className="rounded-2xl border border-white/10 bg-[#111827] shadow-sm">
			<div className="flex items-center justify-between border-b border-white/10 p-5">
				<div>
					<h2 className="text-xl font-semibold">Autres tâches</h2>
				</div>
			</div>

			{tasks.length === 0 ? (
				<div className="py-10 px-2 text-center text-gray-400">
					🌺 <span className="italic">Aucune autre tâche</span> 🌼
				</div>
			) : (
				<>
					<div className="divide-y divide-white/60 p-3">
						{tasks.map((task) => {
							return (
								<div key={task._id}>
									<TaskItem task={task} onClick={() => setSelectedTask(task)} />
								</div>
							);
						})}
					</div>

					{selectedTask && <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} onEdit={handleEdit} onDelete={handleDelete} />}
				</>
			)}
		</div>
	);
}
