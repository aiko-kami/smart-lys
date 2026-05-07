import TaskItem from "./TaskItem";

export default function TasksTodayCard() {
	return (
		<div className="bg-white border rounded-2xl p-5 shadow-sm">
			<div className="flex items-center justify-between mb-5">
				<div>
					<h2 className="text-xl font-semibold">Tâches du jour</h2>

					<p className="text-sm text-muted-foreground mt-1">Vendredi 23 mai 2025</p>
				</div>

				<button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm">+ Nouvelle tâche</button>
			</div>

			<div className="space-y-3">
				<TaskItem />
				<TaskItem />
				<TaskItem />
				<TaskItem />
			</div>
		</div>
	);
}
