import { FaHouseChimney } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";

const apartments = [
	{ name: "Apt. Bord de mer", client: "M. Laurent", status: "occupied", nextCheckout: "3 mai" },
	{ name: "Apt. Vieille Ville", client: "Mme Rossi", status: "checkout", nextCheckout: "Aujourd'hui" },
	{ name: "Studio Centre", client: "M. Girard", status: "available", nextCheckout: null },
	{ name: "Apt. Juan-les-Pins", client: "M. Petit", status: "maintenance", nextCheckout: null },
	{ name: "Apt. Le Cannet", client: "Mme Blanc", status: "occupied", nextCheckout: "28 avr." },
];

const statusConfig: Record<string, { label: string; color: string }> = {
	occupied: { label: "Occupé", color: "text-blue-400" },
	available: { label: "Disponible", color: "text-green-500" },
	maintenance: { label: "Maintenance", color: "text-yellow-500" },
	checkout: { label: "Départ auj.", color: "text-orange-400" },
};

const iconColors = ["text-blue-400", "text-teal-400", "text-amber-400", "text-purple-400", "text-green-400"];

export default function ApartmentsCard() {
	return (
		<section className="rounded-2xl border border-white/10 bg-[#111827] p-4 sm:p-6">
			<h2 className="mb-4 text-xl font-semibold">Appartements</h2>
			<div className="space-y-3">
				{apartments.map((apt, i) => {
					const st = statusConfig[apt.status];
					return (
						<div key={i} className="rounded-xl border border-white/10 p-3">
							{/* Top row: icon + name + status */}
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
									<FaHouseChimney className={`text-sm ${iconColors[i % iconColors.length]}`} />
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-white">{apt.name}</p>
									<p className="truncate text-xs text-gray-400">{apt.client}</p>
								</div>
								<p className={`flex shrink-0 items-center gap-1 text-xs ${st.color}`}>
									<GoDotFill />
									{st.label}
								</p>
							</div>

							{/* Bottom row: next checkout */}
							{apt.nextCheckout && <p className="mt-2 pl-11 text-xs text-gray-500">Départ : {apt.nextCheckout}</p>}
						</div>
					);
				})}
			</div>
		</section>
	);
}
