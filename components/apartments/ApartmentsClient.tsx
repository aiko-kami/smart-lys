"use client";

import { useState, useMemo } from "react";
import { GoDotFill } from "react-icons/go";
import { FaAirbnb } from "react-icons/fa6";
import ApartmentFormModal from "./ApartmentFormModal";

interface Client {
	_id: string;
	name: string;
}

interface Apartment {
	_id: string;
	name: string;
	address: string;
	clientId: Client;
	airbnbIcalUrl?: string;
	status: "available" | "occupied" | "maintenance";
	description?: string;
}

interface ApartmentsClientProps {
	apartments: Apartment[];
}

const STATUS_CONFIG = {
	occupied: { label: "Occupé", color: "text-blue-400", dot: "text-blue-400", bg: "bg-blue-500/10" },
	available: { label: "Disponible", color: "text-green-400", dot: "text-green-400", bg: "bg-green-500/10" },
	maintenance: { label: "Maintenance", color: "text-yellow-400", dot: "text-yellow-400", bg: "bg-yellow-500/10" },
} as const;

const AVATAR_BG = [
	"bg-blue-500/20 text-blue-400",
	"bg-teal-500/20 text-teal-400",
	"bg-amber-500/20 text-amber-400",
	"bg-purple-500/20 text-purple-400",
	"bg-pink-500/20 text-pink-400",
	"bg-green-500/20 text-green-400",
];

function initials(name: string) {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export default function ApartmentsClient({ apartments: initial }: ApartmentsClientProps) {
	const [apartments, setApartments] = useState<Apartment[]>(initial);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [clientFilter, setClientFilter] = useState("all");
	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState<Apartment | null>(null);
	const [deleting, setDeleting] = useState<string | null>(null);

	const clients = useMemo(() => {
		const map = new Map<string, string>();
		apartments.forEach((a) => {
			if (a.clientId) map.set(a.clientId._id, a.clientId.name);
		});
		return Array.from(map.entries());
	}, [apartments]);

	const filtered = useMemo(() => {
		return apartments.filter((a) => {
			const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.address.toLowerCase().includes(search.toLowerCase());
			const matchStatus = statusFilter === "all" || a.status === statusFilter;
			const matchClient = clientFilter === "all" || a.clientId?._id === clientFilter;
			return matchSearch && matchStatus && matchClient;
		});
	}, [apartments, search, statusFilter, clientFilter]);

	const stats = useMemo(
		() => ({
			total: apartments.length,
			occupied: apartments.filter((a) => a.status === "occupied").length,
			available: apartments.filter((a) => a.status === "available").length,
			maintenance: apartments.filter((a) => a.status === "maintenance").length,
		}),
		[apartments],
	);

	async function handleSave(data: Partial<Apartment>) {
		if (editing) {
			const res = await fetch(`/api/apartments/${editing._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (res.ok) {
				const updated = await res.json();
				setApartments((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
			}
		} else {
			const res = await fetch("/api/apartments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (res.ok) {
				const created = await res.json();
				setApartments((prev) => [...prev, created]);
			}
		}
		setModalOpen(false);
		setEditing(null);
	}

	async function handleDelete(id: string) {
		if (!confirm("Supprimer cet appartement ?")) return;
		setDeleting(id);
		await fetch(`/api/apartments/${id}`, { method: "DELETE" });
		setApartments((prev) => prev.filter((a) => a._id !== id));
		setDeleting(null);
	}

	function openEdit(apt: Apartment) {
		setEditing(apt);
		setModalOpen(true);
	}

	function openCreate() {
		setEditing(null);
		setModalOpen(true);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold sm:text-3xl">Appartements</h1>
					<p className="mt-1 text-gray-400">
						{stats.total} bien{stats.total > 1 ? "s" : ""} géré{stats.total > 1 ? "s" : ""} · {stats.occupied} occupé{stats.occupied > 1 ? "s" : ""} ce soir
					</p>
				</div>
				<button onClick={openCreate} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500">
					+ Ajouter un appartement
				</button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{[
					{ label: "Total", value: stats.total, color: "text-white" },
					{ label: "Occupés", value: stats.occupied, color: "text-blue-400" },
					{ label: "Disponibles", value: stats.available, color: "text-green-400" },
					{ label: "Maintenance", value: stats.maintenance, color: "text-yellow-400" },
				].map((s) => (
					<div key={s.label} className="rounded-2xl border border-white/10 bg-[#111827] p-4">
						<p className="text-xs uppercase tracking-wide text-gray-400">{s.label}</p>
						<p className={`mt-2 text-3xl font-bold ${s.color}`}>{s.value}</p>
					</div>
				))}
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-3">
				<input
					type="text"
					placeholder="Rechercher..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
				/>
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className="rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
				>
					<option value="all">Tous les statuts</option>
					<option value="occupied">Occupé</option>
					<option value="available">Disponible</option>
					<option value="maintenance">Maintenance</option>
				</select>
				<select
					value={clientFilter}
					onChange={(e) => setClientFilter(e.target.value)}
					className="rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
				>
					<option value="all">Tous les clients</option>
					{clients.map(([id, name]) => (
						<option key={id} value={id}>
							{name}
						</option>
					))}
				</select>
			</div>

			{/* List */}
			<div className="rounded-2xl border border-white/10 bg-[#111827] overflow-hidden">
				{/* Table header — hidden on small screens */}
				<div className="hidden grid-cols-[2fr_1.2fr_1fr_auto] gap-4 border-b border-white/10 px-5 py-3 sm:grid">
					{["Appartement", "Client", "Statut", ""].map((h) => (
						<p key={h} className="text-xs uppercase tracking-wider text-gray-500">
							{h}
						</p>
					))}
				</div>

				{filtered.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-gray-500">
						<p className="text-sm">Aucun appartement trouvé</p>
					</div>
				) : (
					<ul>
						{filtered.map((apt, i) => {
							const st = STATUS_CONFIG[apt.status] ?? STATUS_CONFIG.available;
							const hasAirbnb = !!apt.airbnbIcalUrl;
							return (
								<li key={apt._id} className="border-b border-white/10 last:border-0">
									{/* Mobile layout */}
									<div className="flex items-start gap-3 p-4 sm:hidden">
										<div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${AVATAR_BG[i % AVATAR_BG.length]}`}>{initials(apt.name)}</div>
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<p className="truncate font-medium">{apt.name}</p>
												{hasAirbnb && <FaAirbnb className="shrink-0 text-[#FF385C]" />}
											</div>
											<p className="mt-0.5 truncate text-xs text-gray-400">{apt.address}</p>
											<div className="mt-2 flex items-center justify-between gap-2">
												<p className="text-xs text-gray-400">{apt.clientId?.name ?? "—"}</p>
												<span className={`flex items-center gap-1 text-xs ${st.color}`}>
													<GoDotFill />
													{st.label}
												</span>
											</div>
											<div className="mt-3 flex gap-2">
												<button onClick={() => openEdit(apt)} className="flex-1 rounded-lg border border-white/10 py-1.5 text-xs text-gray-300 transition hover:bg-white/10">
													Éditer
												</button>
												<button
													onClick={() => handleDelete(apt._id)}
													disabled={deleting === apt._id}
													className="flex-1 rounded-lg border border-red-500/30 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
												>
													{deleting === apt._id ? "..." : "Supprimer"}
												</button>
											</div>
										</div>
									</div>

									{/* Desktop layout */}
									<div className="hidden grid-cols-[2fr_1.2fr_1fr_auto] items-center gap-4 px-5 py-4 sm:grid">
										<div className="flex items-center gap-3 min-w-0">
											<div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${AVATAR_BG[i % AVATAR_BG.length]}`}>{initials(apt.name)}</div>
											<div className="min-w-0">
												<div className="flex items-center gap-2">
													<p className="truncate text-sm font-medium">{apt.name}</p>
													{hasAirbnb && <FaAirbnb className="shrink-0 text-sm text-[#FF385C]" title="Airbnb" />}
												</div>
												<p className="truncate text-xs text-gray-400">{apt.address}</p>
											</div>
										</div>
										<p className="truncate text-sm text-gray-300">{apt.clientId?.name ?? "—"}</p>
										<span className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${st.bg} ${st.color}`}>
											<GoDotFill className="text-[10px]" />
											{st.label}
										</span>
										<div className="flex items-center gap-2">
											<button onClick={() => openEdit(apt)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/10">
												Éditer
											</button>
											<button
												onClick={() => handleDelete(apt._id)}
												disabled={deleting === apt._id}
												className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
											>
												{deleting === apt._id ? "..." : "Supprimer"}
											</button>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</div>

			<p className="text-xs text-gray-500">
				{filtered.length} appartement{filtered.length > 1 ? "s" : ""}
				{filtered.length !== apartments.length && ` sur ${apartments.length}`}
			</p>

			{/* Modal */}
			{modalOpen && (
				<ApartmentFormModal
					apartment={editing}
					onClose={() => {
						setModalOpen(false);
						setEditing(null);
					}}
					onSave={handleSave}
				/>
			)}
		</div>
	);
}
