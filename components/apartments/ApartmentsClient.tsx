"use client";

import { useState, useMemo, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { FaAirbnb, FaTriangleExclamation, FaXmark } from "react-icons/fa6";
import ApartmentFormModal from "./ApartmentFormModal";
import type { Apartment, ClientRef } from "@/types";
import { AVATAR_BG, initials } from "@/utils";

// ── Types ────────────────────────────────────────────────

interface ApartmentsClientProps {
	apartments: Apartment[];
}

// ── Delete confirmation modal ─────────────────────────────

interface DeleteModalProps {
	apartment: Apartment;
	deleting: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

function DeleteModal({ apartment, deleting, onConfirm, onCancel }: DeleteModalProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center" onClick={(e) => e.target === e.currentTarget && onCancel()}>
			<div className="w-full rounded-t-2xl bg-[#0F172A] p-6 sm:max-w-md sm:rounded-2xl">
				<div className="mb-5 flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
							<FaTriangleExclamation className="text-red-400" />
						</div>
						<h2 className="text-base font-semibold">Supprimer l'appartement</h2>
					</div>
					<button onClick={onCancel} className="rounded-lg border border-white/10 p-1.5 text-gray-400 transition hover:bg-white/10">
						<FaXmark size={13} />
					</button>
				</div>

				<div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
					<p className="font-medium">{apartment.name}</p>
					<p className="mt-0.5 text-xs text-gray-400">{apartment.address}</p>
					{typeof apartment.clientId !== "string" && apartment.clientId?.name && <p className="mt-0.5 text-xs text-gray-500">Client : {apartment.clientId.name}</p>}
				</div>

				<p className="mb-6 text-sm text-gray-400">
					Cette action est <span className="font-medium text-white">irréversible</span>. Toutes les données associées à cet appartement seront supprimées définitivement.
				</p>

				<div className="flex gap-3">
					<button onClick={onCancel} disabled={deleting} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-gray-300 transition hover:bg-white/10 disabled:opacity-50">
						Annuler
					</button>
					<button onClick={onConfirm} disabled={deleting} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-50">
						{deleting ? "Suppression..." : "Supprimer"}
					</button>
				</div>
			</div>
		</div>
	);
}

// ── Status badge ──────────────────────────────────────────

function StatusBadge({ occupied }: { occupied?: boolean }) {
	return (
		<span className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${occupied ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"}`}>
			<GoDotFill className="text-[10px]" />
			{occupied ? "Occupé" : "Disponible"}
		</span>
	);
}

// ── Platform icon ─────────────────────────────────────────

function PlatformIcon({ platform }: { platform: "airbnb" | "other" }) {
	if (platform === "airbnb") {
		return (
			<>
				<FaAirbnb className="mt-0.5 mr-1 shrink-0 text-xl text-[#FF385C]" title="Airbnb" />
				<span className="text-base">Airbnb</span>
			</>
		);
	}
	return <span className="text-gray-400">Autre</span>;
}

// ── Main component ────────────────────────────────────────

export default function ApartmentsClient({ apartments: initial }: ApartmentsClientProps) {
	const [apartments, setApartments] = useState<Apartment[]>(initial);
	const [allClients, setAllClients] = useState<ClientRef[]>([]);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [platformFilter, setPlatformFilter] = useState("all");
	const [clientFilter, setClientFilter] = useState("all");
	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState<Apartment | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<Apartment | null>(null);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch("/api/clients")
			.then((r) => r.json())
			.then(setAllClients)
			.catch(() => setAllClients([]));
	}, []);

	const filtered = useMemo(() => {
		return apartments.filter((a) => {
			const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.address.toLowerCase().includes(search.toLowerCase());
			const matchPlatform = platformFilter === "all" || a.platform === platformFilter;
			const matchClient = clientFilter === "all" || (typeof a.clientId !== "string" && a.clientId._id === clientFilter);
			const matchStatus = statusFilter === "all" || (statusFilter === "occupied" && a.occupied) || (statusFilter === "available" && !a.occupied);
			return matchSearch && matchPlatform && matchClient && matchStatus;
		});
	}, [apartments, search, platformFilter, clientFilter, statusFilter]);

	const stats = useMemo(
		() => ({
			total: apartments.length,
			occupied: apartments.filter((a) => a.occupied).length,
			available: apartments.filter((a) => !a.occupied).length,
		}),
		[apartments],
	);

	async function handleSave(data: Partial<Apartment>) {
		setError(null);
		try {
			if (editing) {
				const res = await fetch(`/api/apartments/${editing._id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});
				if (!res.ok) throw new Error("Erreur lors de la modification");
				const updated = await res.json();
				setApartments((prev) => prev.map((a) => (a._id === updated._id ? { ...updated, occupied: a.occupied } : a)));
			} else {
				const res = await fetch("/api/apartments", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});
				if (!res.ok) throw new Error("Erreur lors de la création");
				const created = await res.json();
				setApartments((prev) => [...prev, { ...created, occupied: false }]);
			}
			setModalOpen(false);
			setEditing(null);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Une erreur est survenue");
		}
	}

	async function handleDeleteConfirm() {
		if (!deleteTarget) return;
		setDeleting(true);
		setError(null);
		try {
			const res = await fetch(`/api/apartments/${deleteTarget._id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Erreur lors de la suppression");
			setApartments((prev) => prev.filter((a) => a._id !== deleteTarget._id));
			setDeleteTarget(null);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Une erreur est survenue");
		} finally {
			setDeleting(false);
		}
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
						{stats.total} bien{stats.total > 1 ? "s" : ""} géré{stats.total > 1 ? "s" : ""}
					</p>
				</div>
				<button onClick={openCreate} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500">
					+ Ajouter un appartement
				</button>
			</div>

			{/* Error banner */}
			{error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

			{/* Stats */}
			<div className="grid grid-cols-3 gap-3">
				{[
					{ label: "Total", value: stats.total, color: "text-white" },
					{ label: "Occupés", value: stats.occupied, color: "text-blue-400" },
					{ label: "Disponibles", value: stats.available, color: "text-green-400" },
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
				</select>
				<select
					value={platformFilter}
					onChange={(e) => setPlatformFilter(e.target.value)}
					className="rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
				>
					<option value="all">Toutes les plateformes</option>
					<option value="airbnb">Airbnb</option>
					<option value="other">Autre</option>
				</select>
				<select
					value={clientFilter}
					onChange={(e) => setClientFilter(e.target.value)}
					className="rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
				>
					<option value="all">Tous les clients</option>
					{allClients.map((c) => (
						<option key={c._id} value={c._id}>
							{c.name}
						</option>
					))}
				</select>
			</div>

			{/* List */}
			<div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">
				{filtered.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-gray-500">
						<p className="text-sm">Aucun appartement trouvé</p>
					</div>
				) : (
					<>
						{/* Desktop — standard table */}
						<table className="hidden w-full sm:table">
							<thead>
								<tr className="border-b border-white/10">
									<th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Appartement</th>
									<th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Client</th>
									<th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
									<th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Plateforme</th>
									<th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filtered.map((apt, i) => (
									<tr key={apt._id} className="border-b border-white/10 last:border-0">
										<td className="px-5 py-4">
											<div className="flex min-w-0 items-center gap-3">
												<div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${AVATAR_BG[i % AVATAR_BG.length]}`}>{initials(apt.name)}</div>
												<div className="min-w-0">
													<p className="truncate text-sm font-medium">{apt.name}</p>
													<p className="truncate text-xs text-gray-400">{apt.address}</p>
												</div>
											</div>
										</td>
										<td className="px-5 py-4">
											<p className="truncate text-sm text-gray-300">{typeof apt.clientId === "string" ? "—" : (apt.clientId?.name ?? "—")}</p>
										</td>
										<td className="px-5 py-4 text-center">
											<div className="flex justify-center">
												<StatusBadge occupied={apt.occupied} />
											</div>
										</td>
										<td className="px-5 py-4 text-center">
											<div className="flex justify-center">
												<PlatformIcon platform={apt.platform} />
											</div>
										</td>
										<td className="px-5 py-4">
											<div className="flex items-center justify-center gap-2">
												<button onClick={() => openEdit(apt)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/10">
													Éditer
												</button>
												<button onClick={() => setDeleteTarget(apt)} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10">
													Supprimer
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{/* Mobile — card list */}
						<ul className="sm:hidden">
							{filtered.map((apt, i) => (
								<li key={apt._id} className="border-b border-white/10 last:border-0">
									<div className="flex items-start gap-3 p-4">
										<div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${AVATAR_BG[i % AVATAR_BG.length]}`}>{initials(apt.name)}</div>
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<p className="truncate font-medium">{apt.name}</p>
												<PlatformIcon platform={apt.platform} />
											</div>
											<p className="mt-0.5 truncate text-xs text-gray-400">{apt.address}</p>
											<div className="mt-2 flex items-center justify-between gap-2">
												<p className="text-xs text-gray-400">{typeof apt.clientId === "string" ? "—" : (apt.clientId?.name ?? "—")}</p>
												<StatusBadge occupied={apt.occupied} />
											</div>
											<div className="mt-3 flex gap-2">
												<button onClick={() => openEdit(apt)} className="flex-1 rounded-lg border border-white/10 py-1.5 text-xs text-gray-300 transition hover:bg-white/10">
													Éditer
												</button>
												<button onClick={() => setDeleteTarget(apt)} className="flex-1 rounded-lg border border-red-500/30 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10">
													Supprimer
												</button>
											</div>
										</div>
									</div>
								</li>
							))}
						</ul>
					</>
				)}
			</div>

			<p className="text-xs text-gray-500">
				{filtered.length} appartement{filtered.length > 1 ? "s" : ""}
				{filtered.length !== apartments.length && ` sur ${apartments.length}`}
			</p>

			{/* Form modal */}
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

			{/* Delete confirmation modal */}
			{deleteTarget && <DeleteModal apartment={deleteTarget} deleting={deleting} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />}
		</div>
	);
}
