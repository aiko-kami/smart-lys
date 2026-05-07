import TaskItem from "./TaskItem";

export default function UpcomingTasksCard() {
	return (
		<div className="bg-white border rounded-2xl p-5 shadow-sm">
			<div className="mb-5">
				<h2 className="text-xl font-semibold">Tâches à venir</h2>
			</div>

			<div className="space-y-3">
				<TaskItem />
				<TaskItem />
				<TaskItem />
			</div>
		</div>
	);
}
