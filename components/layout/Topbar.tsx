"use client";
import { Button } from "@/components/Buttons/Buttons";
import { FaArrowRotateRight, FaPlus, FaBars } from "react-icons/fa6";

interface TopbarProps {
	onMenuOpen: () => void;
}

export default function Topbar({ onMenuOpen }: TopbarProps) {
	return (
		<header className="border-b border-white/10 bg-[#0B1220] px-4 py-4 sm:px-6 lg:px-8">
			<div className="flex items-center gap-8">
				{/* Burger button */}
				<button onClick={onMenuOpen} aria-label="Ouvrir le menu" className="rounded-lg border border-white/10 p-2.5 text-gray-300 transition hover:bg-white/10">
					<FaBars className="h-4 w-4" />
				</button>

				{/* Title + actions */}
				<div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold sm:text-3xl">Bonjour Pauline</h1>
						<p className="text-gray-400 pt-1">Samedi 25 avril 2026</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row">
						<Button btnColor="grayOutline" btnRounded="xl">
							<div className="flex items-center">
								Nouvelle facture
								<FaPlus className="ml-2 mt-0.5" />
							</div>
						</Button>
						<Button btnColor="grayOutline" btnRounded="xl">
							<div className="flex items-center">
								Refresh Airbnb
								<FaArrowRotateRight className="ml-2 mt-0.5" />
							</div>
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
