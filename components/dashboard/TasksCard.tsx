const tasks = ["Ménage après départ", "Check-in famille Martin", "Check-out M. Dupont", "Remise des clés"];

export default function TasksCard() {
	return (
		<section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
			<h2 className="mb-6 text-xl font-semibold">Tâches du jour</h2>

			<div className="space-y-4">
				{tasks.map((task) => (
					<div key={task} className="rounded-xl border border-white/10 p-4 text-gray-300">
						{task}
					</div>
				))}
			</div>
		</section>
	);
}
