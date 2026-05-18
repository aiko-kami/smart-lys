"use client";

import type { Apartment } from "@/types";

interface Props {
	apartments: Apartment[];

	selectedApartments: string[];
	selectedPlatforms: string[];

	onApartmentsChange: (ids: string[]) => void;
	onPlatformsChange: (platforms: string[]) => void;
}

export default function ReservationsFilters({ apartments, selectedApartments, selectedPlatforms, onApartmentsChange, onPlatformsChange }: Props) {
	const platforms = [
		{ id: "airbnb", label: "Airbnb", color: "text-red-300 border-red-400 bg-red-500/10" },
		{ id: "booking", label: "Booking", color: "text-blue-300 border-blue-400 bg-blue-500/10" },
		{ id: "direct", label: "Direct", color: "text-emerald-300 border-emerald-400 bg-emerald-500/10" },
		{ id: "other", label: "Autre", color: "text-violet-300 border-violet-400 bg-violet-500/10" },
	];

	return (
		<div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
			<h2 className="text-lg font-semibold">Filtres</h2>

			{/* Apartments */}
			<div className="mt-4">
				<p className="mb-2 text-xs text-gray-400">Appartements</p>

				<div className="flex flex-wrap gap-2">
					{apartments.map((apartment, index) => {
						const active = selectedApartments.includes(apartment._id);

						const colors = [
							"bg-violet-500/15 border-violet-400 text-violet-300",
							"bg-emerald-500/15 border-emerald-400 text-emerald-300",
							"bg-amber-500/15 border-amber-400 text-amber-300",
							"bg-pink-500/15 border-pink-400 text-pink-300",
							"bg-sky-500/15 border-sky-400 text-sky-300",
						];

						const color = colors[index % colors.length];

						return (
							<button
								key={apartment._id}
								onClick={() => {
									onApartmentsChange(active ? selectedApartments.filter((id) => id !== apartment._id) : [...selectedApartments, apartment._id]);
								}}
								className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${active ? `${color} ring-2 ring-white/10` : "border-white/10 text-gray-300 hover:bg-white/5"}`}
							>
								<span className={`h-2 w-2 rounded-full ${active ? "bg-current" : "bg-gray-500"}`} />
								{apartment.name}
							</button>
						);
					})}
				</div>
			</div>

			{/* Platforms */}
			<div className="mt-6">
				<p className="mb-2 text-xs text-gray-400">Plateformes</p>

				<div className="flex flex-wrap gap-2">
					{platforms.map((platform) => {
						const active = selectedPlatforms.includes(platform.id);

						return (
							<button
								key={platform.id}
								onClick={() => {
									onPlatformsChange(active ? selectedPlatforms.filter((p) => p !== platform.id) : [...selectedPlatforms, platform.id]);
								}}
								className={`rounded-full border px-3 py-1.5 text-sm transition ${active ? `${platform.color} ring-2 ring-white/10` : "border-white/10 text-gray-300 hover:bg-white/5"}`}
							>
								{platform.label}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
