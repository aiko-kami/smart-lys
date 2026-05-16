"use client";

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import ClientFormModal from "./ClientFormModal";
import DeleteClientModal from "./DeleteClientModal";
import ClientDetailsModal from "./ClientDetailsModal";
import type { Client, ClientsClientProps } from "@/types";
import { AVATAR_BG, initials, formatDate } from "@/utils";
import { RemoveButton, EditButton } from "@/components/buttons/Buttons";

export default function ClientsClient({ clients: initial }: ClientsClientProps) {
	const [clients, setClients] = useState<Client[]>(initial);
	const [search, setSearch] = useState("");
	const [detailsTarget, setDetailsTarget] = useState<Client | null>(null);
	const [editing, setEditing] = useState<Client | null | "new">(null);
	const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return clients.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
	}, [clients, search]);

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
			toast.success("Client suprimé");
			setClients((prev) => prev.filter((c) => c._id !== deleteTarget._id));
			setDeleteTarget(null);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Une erreur est survenue");
			toast.error(e instanceof Error ? e.message : "Une erreur est survenue");
		} finally {
			setDeleting(false);
		}
	}

	function openEdit(client: Client) {
		setEditing(client);
	}

	function openCreate() {
		setEditing("new");
	}

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
				<button onClick={openCreate} className="rounded-xl bg-indigo-600 bg- px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
					+ Nouveau client
				</button>
			</div>

			{/* Search */}
			<input
				type="text"
				placeholder="Rechercher par nom, email, téléphone..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="w-full rounded-xl border border-white/10 bg-[#111827] px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
			/>

			{/* List */}
			<div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">
				{filtered.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-gray-500">
						<p className="text-sm">Aucun client trouvé</p>
					</div>
				) : (
					<>
						{/* Desktop — standard table */}
						<table className="hidden w-full sm:table">
							<thead>
								<tr className="border-b border-white/10">
									<th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Client</th>
									<th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
									<th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Téléphone</th>
									<th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Depuis le</th>
									<th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filtered.map((client, i) => (
									<tr key={client._id} className="border-b border-white/10 last:border-0">
										<td className="px-5 py-4">
											<div className="flex min-w-0 items-center gap-3 cursor-pointer" onClick={() => setDetailsTarget(client)}>
												<div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${AVATAR_BG[i % AVATAR_BG.length]}`}>{initials(client.name)}</div>
												<div className="min-w-0">
													<p className="truncate text-sm font-medium">{client.name}</p>
													{client.description && <p className="truncate text-xs text-gray-500">{client.description}</p>}
													{client.address && <p className="truncate text-xs text-gray-500">{client.address}</p>}
												</div>
											</div>
										</td>
										<td className="px-5 py-4">
											{client.email ? (
												<p className="truncate text-center text-sm text-gray-300">
													<a href={`mailto:${client.email}`} className="hover:underline hover:text-white">
														{client.email}
													</a>
												</p>
											) : (
												<p className="text-center text-sm text-gray-500">—</p>
											)}
										</td>
										<td className="px-5 py-4">
											{client.phone ? (
												<p className="text-center text-sm text-gray-400">
													<a href={`tel:${client.phone}`} className="hover:text-white hover:underline">
														{client.phone}
													</a>
												</p>
											) : (
												<p className="text-center text-sm text-gray-500">—</p>
											)}
										</td>
										<td className="px-5 py-4">
											<p className="text-center text-sm text-gray-400">{formatDate(client.startDate)}</p>
										</td>
										<td className="px-5 py-4">
											<div className="flex items-center justify-center gap-2">
												<EditButton action={() => openEdit(client)} btnSize="xs" />
												<RemoveButton action={() => setDeleteTarget(client)} btnSize="xs" />
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{/* Mobile — card list */}
						<ul className="sm:hidden">
							{filtered.map((client, i) => (
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
												{client.address && <p className="mt-1 text-xs text-gray-600">{client.address}</p>}
											</div>
											<div className="mt-3 flex gap-2">
												<EditButton action={() => openEdit(client)} btnSize="xs" />
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
				{filtered.length} client{filtered.length > 1 ? "s" : ""}
				{filtered.length !== clients.length && ` sur ${clients.length}`}
			</p>

			{/* Form modal */}
			{editing && (
				<ClientFormModal
					client={editing === "new" ? null : editing}
					onClose={() => {
						setEditing(null);
					}}
					onSave={handleSave}
				/>
			)}

			{/* Delete modal */}
			{deleteTarget && <DeleteClientModal client={deleteTarget} deleting={deleting} onConfirm={handleDeleteConfirm} onClose={() => setDeleteTarget(null)} />}

			{/* Details modal */}

			{detailsTarget && (
				<ClientDetailsModal
					client={detailsTarget}
					onClose={() => setDetailsTarget(null)}
					onEdit={(client) => {
						setDetailsTarget(null);
						openEdit(client);
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
