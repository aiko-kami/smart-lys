"use client";

import Image from "next/image";
import Link from "next/link";
import { FaBars } from "react-icons/fa6";

interface TopbarProps {
	onMenuOpen: () => void;
}

export default function Topbar({ onMenuOpen }: TopbarProps) {
	const today = new Date();

	const formattedDate = today.toLocaleDateString("fr-FR", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return (
		<header className="border-b border-white/10 bg-[#0B1220] px-4 sm:px-6 lg:pl-8 lg:pr-10">
			<div className="flex items-center justify-between">
				{/* LEFT: Menu + Logo */}
				<div className="flex items-center gap-5">
					<button onClick={onMenuOpen} aria-label="Ouvrir le menu" className="rounded-lg border border-white/10 p-2.5 text-gray-300 transition hover:bg-white/10">
						<FaBars className="h-4 w-4" />
					</button>

					{/* Logo + Brand */}
					<Link href="/">
						<Image src="/images/logo-smart-lys.png" alt="Smart-lys" width={0} height={0} sizes="100vw" className="w-20 h-auto object-contain" />
					</Link>
				</div>

				{/* RIGHT: Greeting */}
				<div className="flex flex-col items-end py-4">
					<h1 className="text-xl font-bold sm:text-2xl">Bonjour Pauline</h1>
					<p className="pt-1 text-sm text-gray-400 capitalize">{formattedDate}</p>
				</div>
			</div>
		</header>
	);
}
