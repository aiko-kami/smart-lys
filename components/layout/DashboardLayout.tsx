"use client";
import { ReactNode, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="min-h-screen bg-[#070B14] text-white">
			{/* Sidebar — always fixed overlay, never pushes content */}
			<div className={`fixed inset-y-0 left-0 z-50 w-[240px] border-r border-white/10 bg-[#0F172A] transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
				<Sidebar onClose={() => setSidebarOpen(false)} />
			</div>

			{/* Dim overlay */}
			{sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

			{/* Main — always full width */}
			<div className="flex min-h-screen flex-col">
				<Topbar onMenuOpen={() => setSidebarOpen(true)} />
				<main className="flex-1 bg-[#070B14] p-4 sm:p-6 lg:p-8">
					<div className="mx-auto max-w-7xl space-y-6">{children}</div>
				</main>
			</div>
		</div>
	);
}
