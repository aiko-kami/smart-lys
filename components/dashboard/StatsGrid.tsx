import { GoDotFill } from "react-icons/go";

const stats = [
	{ title: "Appartements", value: "8", details: "6 appartements occupés", light: "green" },
	{ title: "Réservations actives", value: "7", details: "2 départs demain", light: "orange" },
	{ title: "Tâches aujourd'hui", value: "5", details: "2 tâches urgentes", light: "orange" },
	{ title: "Chiffre d'affaires ce mois", value: "3840€", details: "+12% depuis le mois dernier", light: "green" },
];

export default function StatsGrid() {
	return (
		<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{stats.map((stat) => (
				<div key={stat.title} className="rounded-2xl border border-white/10 bg-[#111827] p-6">
					<p className="text-sm uppercase tracking-wide text-gray-400">{stat.title}</p>
					<h3 className="mt-4 text-3xl font-bold">{stat.value}</h3>

					<p className={`mt-2 text-xs flex ${stat.light === "green" ? "text-green-500" : stat.light === "orange" ? "text-yellow-500" : "text-red-500"}`}>
						<GoDotFill className="mt-0.5 mr-1" />
						{stat.details}
					</p>
				</div>
			))}
		</section>
	);
}
