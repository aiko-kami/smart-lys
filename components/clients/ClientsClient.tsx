"use client";

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import ClientFormModal from "./ClientFormModal";
import DeleteClientModal from "./DeleteClientModal";
import ClientDetailsModal from "./ClientDetailsModal";
import type { Client, ClientsClientProps } from "@/types";
import { AVATAR_BG, initials, formatDate } from "@/utils";
import { RemoveButton, EditButton } from "@/components/buttons/Buttons";
import { Th } from "@/components/ui/SortableTable";
import { useSort } from "@/hooks/useSort";

type ClientSortKey = "name" | "email" | "phone" | "startDate";

// Mobile sort options
const MOBILE_SORT_OPTIONS: { label: string; key: ClientSortKey }[] = [
	{ label: "Nom", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Téléphone", key: "phone" },
	{ label: "Depuis le", key: "startDate" },
];

export default function ClientsClient({ clients: initial }: ClientsClientProps) {
	const [clients, setClients] = useState<Client[]>(initial);
	const [search, setSearch] = useState("");
	const [detailsTarget, setDetailsTarget] = useState<Client | null>(null);
	const [editing, setEditing] = useState<Client | null | "new">(null);
	const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// ── Filter ────────────────────────────────────────────────────────────────
	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return clients.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
	}, [clients, search]);

	// ── Sort ──────────────────────────────────────────────────────────────────
	const { sorted, sortKey, sortDir, handleSort } = useSort<Client, ClientSortKey>(filtered, "name");

	// ── Actions ───────────────────────────────────────────────────────────────
	async function handleSave(data: Partial<Client>) {
		setError(null);
		try {
			if (editing && editing !== "new") {
				const res = await fetch(`/api/clients/${editing._id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});
				if (!res.ok) throw new Error("Erreur lors de la modification du client");
				const updated = await res.json();
				toast.success("Client mis à jour");
				setClients((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
			} else {
				const res = await fetch("/api/clients", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});
				if (!res.ok) throw new Error("Erreur lors de la création du client");
				const created = await res.json();
				toast.success("Nouveau client créé");
				setClients((prev) => [...prev, created]);
			}
			setEditing(null);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Une erreur est survenue");
			toast.error(e instanceof Error ? e.message : "Une erreur est survenue");
		}
	}

	async function handleDeleteConfirm() {
		if (!deleteTarget) return;
		setDeleting(true);
		setError(null);
		try {
			const res = await fetch(`/api/clients/${deleteTarget._id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Erreur lors de la suppression");
			toast.success("Client supprimé");
			setClients((prev) => prev.filter((c) => c._id !== deleteTarget._id));
			setDeleteTarget(null);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Une erreur est survenue");
			toast.error(e instanceof Error ? e.message : "Une erreur est survenue");
		} finally {
			setDeleting(false);
		}
	}

	// ── UI ────────────────────────────────────────────────────────────────────
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold sm:text-3xl">Clients</h1>
					<p className="mt-1 text-gray-400">
						{clients.length} client{clients.length > 1 ? "s" : ""} enregistré{clients.length > 1 ? "s" : ""}
					</p>
				</div>
				<button onClick={() => setEditing("new")} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
					+ Nouveau client
				</button>
			</div>

			{/* Search + mobile sort */}
			<div className="flex flex-wrap gap-3">
				<input
					type="text"
					placeholder="Rechercher par nom, email, téléphone..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#111827] px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
				/>

				{/* Mobile sort selector — visible only on small screens */}
				<div className="flex items-center gap-2 sm:hidden">
					<select value={sortKey} onChange={(e) => handleSort(e.target.value as ClientSortKey)} className="rounded-xl border border-white/10 bg-[#111827] px-3 py-2.5 text-sm text-white outline-none">
						{MOBILE_SORT_OPTIONS.map((o) => (
							<option key={o.key} value={o.key}>
								{o.label}
							</option>
						))}
					</select>
					<button onClick={() => handleSort(sortKey)} className="rounded-xl border border-white/10 bg-[#111827] px-3 py-2.5 text-sm text-white" title={sortDir === "asc" ? "Croissant" : "Décroissant"}>
						{sortDir === "asc" ? "↑" : "↓"}
					</button>
				</div>
			</div>

			{/* List */}
			<div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">
				{sorted.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-gray-500">
						<p className="text-sm">Aucun client trouvé</p>
					</div>
				) : (
					<>
						{/* ── DESKTOP ── */}
						<table className="hidden w-full sm:table">
							<thead>
								<tr className="border-b border-white/10">
									<Th label="Client" sortKey="name" current={sortKey} dir={sortDir} onSort={handleSort} align="left" />
									<Th label="Email" sortKey="email" current={sortKey} dir={sortDir} onSort={handleSort} />
									<Th label="Téléphone" sortKey="phone" current={sortKey} dir={sortDir} onSort={handleSort} />
									<Th label="Depuis le" sortKey="startDate" current={sortKey} dir={sortDir} onSort={handleSort} />
									<th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 cursor-default">Actions</th>
								</tr>
							</thead>
							<tbody>
								{sorted.map((client, i) => (
									<tr key={client._id} className="border-b border-white/10 last:border-0">
										<td className="px-5 py-4">
											<div className="flex min-w-0 items-center gap-3 cursor-pointer" onClick={() => setDetailsTarget(client)}>
												<div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${AVATAR_BG[i % AVATAR_BG.length]}`}>{initials(client.name)}</div>
												<div className="min-w-0">
													<p className="truncate text-sm font-medium">{client.name}</p>
													{client.description && <p className="truncate text-xs text-gray-500">{client.description}</p>}
													{client.company && <p className="truncate text-xs text-gray-500">{client.company}</p>}
													{client.address && <p className="truncate text-xs text-gray-500">{client.address}</p>}
												</div>
											</div>
										</td>
										<td className="hidden lg:table-cell px-5 py-4 text-center">
											{client.email ? (
												<a href={`mailto:${client.email}`} className="text-sm text-gray-300 hover:underline hover:text-white">
													{client.email}
												</a>
											) : (
												<span className="text-sm text-gray-500">—</span>
											)}
										</td>
										<td className="hidden lg:table-cell px-5 py-4 text-center">
											{client.phone ? (
												<a href={`tel:${client.phone}`} className="text-sm text-gray-400 hover:text-white hover:underline">
													{client.phone}
												</a>
											) : (
												<span className="text-sm text-gray-500">—</span>
											)}
										</td>
										<td className="px-5 py-4 text-center text-sm text-gray-400">{formatDate(client.startDate)}</td>
										<td className="px-5 py-4">
											<div className="flex items-center justify-center gap-2">
												<EditButton action={() => setEditing(client)} btnSize="xs" />
												<RemoveButton action={() => setDeleteTarget(client)} btnSize="xs" />
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{/* ── MOBILE ── */}
						<ul className="sm:hidden">
							{sorted.map((client, i) => (
								<li key={client._id} className="border-b border-white/10 last:border-0">
									<div className="flex items-start gap-3 p-4">
										<div
											onClick={() => setDetailsTarget(client)}
											className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold cursor-pointer ${AVATAR_BG[i % AVATAR_BG.length]}`}
										>
											{initials(client.name)}
										</div>
										<div className="min-w-0 flex-1">
											<div onClick={() => setDetailsTarget(client)} className="cursor-pointer">
												<p className="truncate font-medium">{client.name}</p>
												<p className="mt-0.5 truncate text-xs text-gray-400">{client.email}</p>
												{client.phone && <p className="mt-0.5 text-xs text-gray-500">{client.phone}</p>}
												{client.description && <p className="mt-1 text-xs text-gray-600">{client.description}</p>}
												{client.company && <p className="mt-1 text-xs text-gray-600">{client.company}</p>}
												{client.address && <p className="mt-1 text-xs text-gray-600">{client.address}</p>}
											</div>
											<div className="mt-3 flex gap-2">
												<EditButton action={() => setEditing(client)} btnSize="xs" />
												<RemoveButton action={() => setDeleteTarget(client)} btnSize="xs" />
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
				{sorted.length} client{sorted.length > 1 ? "s" : ""}
				{sorted.length !== clients.length && ` sur ${clients.length}`}
			</p>

			{/* Modals */}
			{editing && <ClientFormModal client={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSave={handleSave} />}
			{deleteTarget && <DeleteClientModal client={deleteTarget} deleting={deleting} onConfirm={handleDeleteConfirm} onClose={() => setDeleteTarget(null)} />}
			{detailsTarget && (
				<ClientDetailsModal
					client={detailsTarget}
					onClose={() => setDetailsTarget(null)}
					onEdit={(client) => {
						setDetailsTarget(null);
						setEditing(client);
					}}
					onDelete={(client) => {
						setDetailsTarget(null);
						setDeleteTarget(client);
					}}
				/>
			)}
		</div>
	);
}
