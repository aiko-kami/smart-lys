import { FaAirbnb } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";

const reservations = [
	{ guest: "Famille Martin", apartment: "Apt. Bord de mer", checkIn: "26 avr.", checkOut: "3 mai", nights: 7, source: "airbnb", status: "confirmed" },
	{ guest: "Sophie Bernard", apartment: "Apt. Vieille Ville", checkIn: "27 avr.", checkOut: "4 mai", nights: 7, source: "airbnb", status: "confirmed" },
	{ guest: "Jean Durand", apartment: "Studio Centre", checkIn: "25 avr.", checkOut: "27 avr.", nights: 2, source: "direct", status: "pending" },
	{ guest: "Maria Kowalski", apartment: "Apt. Juan-les-Pins", checkIn: "1 mai", checkOut: "8 mai", nights: 7, source: "airbnb", status: "confirmed" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
	confirmed: { label: "Confirmé", color: "text-green-500" },
	pending: { label: "En attente", color: "text-yellow-500" },
	cancelled: { label: "Annulé", color: "text-red-500" },
};

function initials(name: string) {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

const avatarColors = ["bg-blue-500/20 text-blue-400", "bg-purple-500/20 text-purple-400", "bg-teal-500/20 text-teal-400", "bg-amber-500/20 text-amber-400"];

export default function ReservationsCard() {
	return (
		<section className="rounded-2xl border border-white/10 bg-[#111827] p-4 sm:p-6">
			<h2 className="mb-4 text-xl font-semibold">Réservations à venir</h2>
			<div className="space-y-3">
				{reservations.map((r, i) => {
					const st = statusConfig[r.status];
					return (
						<div key={i} className="rounded-xl border border-white/10 p-3">
							{/* Top row: avatar + name + source icon */}
							<div className="flex items-center gap-3">
								<div className={`hidden md:flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColors[i % avatarColors.length]}`}>{initials(r.guest)}</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-white">{r.guest}</p>
									<p className="truncate text-xs text-gray-400">{r.apartment}</p>
								</div>
								{r.source === "airbnb" && <FaAirbnb className="shrink-0 text-lg text-[#FF385C]" title="Airbnb" />}
							</div>

							{/* Bottom row: dates + status */}
							<div className="mt-2 flex items-center justify-between gap-2 md:pl-11">
								<p className="text-xs text-gray-400">
									{r.checkIn} → {r.checkOut}
									<span className="ml-1.5 text-gray-500">
										· {r.nights} nuit{r.nights > 1 ? "s" : ""}
									</span>
								</p>
								<p className={`flex shrink-0 items-center gap-1 text-xs ${st.color}`}>
									<GoDotFill />
									{st.label}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
