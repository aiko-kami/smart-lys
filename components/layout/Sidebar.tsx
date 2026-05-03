import { useState } from "react";
import Link from "next/link";
import { FaNewspaper, FaCalendarDay, FaCartFlatbedSuitcase, FaListCheck, FaHouseChimney, FaUserGroup, FaFileInvoice, FaArrowRotateRight } from "react-icons/fa6";
import Image from "next/image";

const menu = [
	{ label: "Tableau de bord", path: "/", icon: <FaNewspaper className="shrink-0" /> },
	{ label: "Calendrier", path: "/calendar", icon: <FaCalendarDay className="shrink-0" /> },
	{ label: "Réservations", path: "/reservations", icon: <FaCartFlatbedSuitcase className="shrink-0" /> },
	{ label: "Tâches du jour", path: "/tasks", icon: <FaListCheck className="shrink-0" /> },
	{ label: "Appartements", path: "/apartments", icon: <FaHouseChimney className="shrink-0" /> },
	{ label: "Clients", path: "/clients", icon: <FaUserGroup className="shrink-0" /> },
	{ label: "Factures", path: "/invoices", icon: <FaFileInvoice className="shrink-0" /> },
];

interface SidebarProps {
	onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
	const [loading, setLoading] = useState(false);
	const refresh = async () => {
		try {
			setLoading(true);
			await new Promise((resolve) => setTimeout(resolve, 3000));
		} finally {
			setLoading(false);
		}
	};

	return (
		<aside className="flex h-full flex-col relative">
			{/* Close button */}
			<button
				onClick={onClose}
				aria-label="Fermer le menu"
				className="absolute right-2 top-2 rounded-lg bg-gray-600/60 border border-white/10 px-2.5 py-1 text-lg text-gray-300 transition hover:bg-gray-600/50"
			>
				✕
			</button>
			{/* Logo */}
			<div className="flex items-center justify-center border-b border-white/10 px-4 py-3 bg-white">
				<Image src="/images/logo.png" alt="Logo" width={200} height={200} className="object-contain" />
			</div>

			{/* Navigation — clicking a link also closes the sidebar */}
			<nav className="flex-1 space-y-1 overflow-y-auto p-3">
				{menu.map((item) => (
					<Link key={item.path} href={item.path} prefetch={false} onClick={onClose}>
						<span className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-blue-500/10 hover:text-blue-400">
							{item.icon}
							{item.label}
						</span>
					</Link>
				))}
				<button onClick={refresh} className="w-full cursor-pointer">
					<span className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-emerald-500/10 hover:text-emerald-400">
						<FaArrowRotateRight className={`shrink-0 transition-transform ${loading ? "animate-spin" : ""}`} />
						{loading ? "Rafraîchissement..." : "Rafraîchir Airbnb"}
					</span>
				</button>
			</nav>

			<div className="border-t border-white/10 px-4 py-3 text-xs text-gray-500">v1.0 Smart Lys</div>
		</aside>
	);
}
