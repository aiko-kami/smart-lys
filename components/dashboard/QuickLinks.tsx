import Link from "next/link";
import { FaFileInvoiceDollar, FaCalendarCheck, FaListCheck, FaBuilding, FaUsers } from "react-icons/fa6";

const LINKS = [
	{ label: "Réservations", href: "/reservations", icon: FaCalendarCheck, color: "text-blue-400" },
	{ label: "Tâches", href: "/tasks", icon: FaListCheck, color: "text-emerald-400" },
	{ label: "Appartements", href: "/apartments", icon: FaBuilding, color: "text-amber-400" },
	{ label: "Clients", href: "/clients", icon: FaUsers, color: "text-purple-400" },
	{ label: "Factures", href: "/invoices", icon: FaFileInvoiceDollar, color: "text-rose-400" },
];

export default function QuickLinks() {
	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
			{LINKS.map(({ label, href, icon: Icon, color }) => (
				<Link
					key={href}
					href={href}
					className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#111827] px-4 py-8 text-center transition hover:bg-white/10 hover:border-white/20"
				>
					<Icon size={26} className={color} />
					<span className="font-medium text-white">{label}</span>
				</Link>
			))}
		</div>
	);
}
