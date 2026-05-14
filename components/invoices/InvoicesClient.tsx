"use client";

import { useState, useMemo } from "react";
import type { Invoice, Client } from "@/types";
import { formatDate } from "@/utils/invoice";
import InvoiceStatusBadge from "@/components/ui/InvoiceStatusBadge";
import InvoiceFormModal from "@/components/invoices/InvoiceFormModal";
import DeleteInvoiceModal from "@/components/invoices/DeleteInvoiceModal";

export default function InvoicedClient({ invoices: initial, clients }: { invoices: Invoice[]; clients: Client[] }) {
	const [invoices, setInvoices] = useState(initial);

	const [allClients] = useState<Client[]>(clients);

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [clientFilter, setClientFilter] = useState("all");

	// ── Modals ─────────────────────────────
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
	const [deleteModal, setDeleteModal] = useState<Invoice | null>(null);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// ── FILTER ─────────────────────────────
	const filtered = useMemo(() => {
		return invoices.filter((inv) => {
			// search
			const matchSearch = inv.number.toLowerCase().includes(search.toLowerCase()) || (typeof inv.clientId !== "string" && inv.clientId?.name?.toLowerCase().includes(search.toLowerCase()));

			// status
			const matchStatus = statusFilter === "all" || inv.status === statusFilter;

			// client
			const matchClient = clientFilter === "all" || (typeof inv.clientId !== "string" && inv.clientId?._id === clientFilter);

			return matchSearch && matchStatus && matchClient;
		});
	}, [invoices, search, statusFilter, clientFilter]);

	// ── STATS ─────────────────────────────
	const stats = useMemo(
		() => ({
			total: invoices.length,
			paid: invoices.filter((i) => i.status === "paid").length,
			late: invoices.filter((i) => i.status === "late").length,
		}),
		[invoices],
	);

	// ── HELPERS ─────────────────────────────
	function getClientName(clientId: Invoice["clientId"]) {
		if (!clientId) return "Client inconnu";
		if (typeof clientId === "string") return "Client inconnu";
		return clientId.name ?? "Client inconnu";
	}

	// ── ACTIONS ─────────────────────────────
	function openCreate() {
		setSelectedInvoice(null);
		setModalOpen(true);
	}

	function handleEdit(inv: Invoice) {
		setSelectedInvoice(inv);
		setModalOpen(true);
	}

	async function handleSave(data: Partial<Invoice>) {
		setError(null);

		try {
			if (selectedInvoice) {
				const res = await fetch(`/api/invoices/${selectedInvoice._id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});

				if (!res.ok) throw new Error("Erreur lors de la modification");

				const updated = await res.json();

				setInvoices((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
			} else {
				const res = await fetch("/api/invoices", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});

				if (!res.ok) throw new Error("Erreur lors de la création");

				const created = await res.json();

				setInvoices((prev) => [...prev, created]);
			}

			setModalOpen(false);
			setSelectedInvoice(null);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Erreur inconnue");
		}
	}

	async function handleDelete(id: string) {
		setDeleting(true);
		setError(null);

		try {
			const res = await fetch(`/api/invoices/${id}`, {
				method: "DELETE",
			});

			if (!res.ok) throw new Error("Erreur lors de la suppression");

			setInvoices((prev) => prev.filter((i) => i._id !== id));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Erreur inconnue");
		} finally {
			setDeleting(false);
		}
	}

	// ── UI ─────────────────────────────
	return (
		<div className="space-y-6">
			{/* HEADER */}
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold sm:text-3xl">Factures</h1>
					<p className="mt-1 text-gray-400">
						{invoices.length} facture{invoices.length > 1 ? "s" : ""}
					</p>
				</div>

				<button onClick={openCreate} className="rounded-xl bg-emerald-600 bg- px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500">
					+ Nouvelle facture
				</button>
			</div>

			{/* ERROR */}
			{error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

			{/* STATS */}
			<div className="grid grid-cols-3 gap-3">
				{[
					{ label: "Total", value: stats.total, color: "text-white" },
					{ label: "Payées", value: stats.paid, color: "text-green-400" },
					{ label: "En retard", value: stats.late, color: "text-red-400" },
				].map((s) => (
					<div key={s.label} className="rounded-2xl border border-white/10 bg-[#111827] p-4">
						<p className="text-xs uppercase text-gray-400">{s.label}</p>
						<p className={`mt-2 text-3xl font-bold ${s.color}`}>{s.value}</p>
					</div>
				))}
			</div>

			{/* FILTERS */}
			<div className="flex flex-wrap gap-3">
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Rechercher..."
					className="flex-1 min-w-0 rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white"
				/>

				<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white">
					<option value="all">Tous les statuts</option>
					<option value="draft">Brouillon</option>
					<option value="sent">Envoyé</option>
					<option value="paid">Payé</option>
					<option value="late">En retard</option>
				</select>

				<select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} className="rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white">
					<option value="all">Tous les clients</option>
					{allClients.map((c) => (
						<option key={c._id} value={c._id}>
							{c.name}
						</option>
					))}
				</select>
			</div>

			{/* TABLE */}
			<div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111827]">
				<table className="w-full">
					<thead>
						<tr className="border-b border-white/10 text-xs uppercase text-gray-500">
							<th className="px-5 py-3 text-left">Client</th>
							<th className="px-5 py-3 text-center">N°</th>
							<th className="px-5 py-3 text-center">Date</th>
							<th className="px-5 py-3 text-center">Montant</th>
							<th className="px-5 py-3 text-center">Statut</th>
							<th className="px-5 py-3 text-center">Actions</th>
						</tr>
					</thead>

					<tbody>
						{filtered.map((inv) => (
							<tr key={inv._id} className="border-b border-white/10">
								<td className="px-5 py-4">{getClientName(inv.clientId)}</td>
								<td className="px-5 py-4 text-center">{inv.number}</td>
								<td className="px-5 py-4 text-center">{formatDate(inv.date)}</td>
								<td className="px-5 py-4 text-center">{inv.total} €</td>
								<td className="px-5 py-4 text-center">
									<InvoiceStatusBadge status={inv.status} />
								</td>
								<td className="px-5 py-4">
									<div className="flex justify-center gap-2">
										<button onClick={() => window.open(`/api/invoices/${inv._id}/pdf`, "_blank")} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10">
											Ouvrir
										</button>

										<button onClick={() => handleEdit(inv)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10">
											Éditer
										</button>

										<button onClick={() => setDeleteModal(inv)} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">
											Supprimer
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<p className="text-xs text-gray-500">
				{filtered.length} facture{filtered.length > 1 ? "s" : ""}
				{filtered.length !== invoices.length && ` sur ${invoices.length}`}
			</p>

			{/* MODALS */}
			{modalOpen && <InvoiceFormModal invoice={selectedInvoice} clients={clients} onClose={() => setModalOpen(false)} onSave={handleSave} />}

			{deleteModal && (
				<DeleteInvoiceModal
					invoice={deleteModal}
					deleting={deleting}
					onCancel={() => setDeleteModal(null)}
					onConfirm={async () => {
						await handleDelete(deleteModal._id);
						setDeleteModal(null);
					}}
				/>
			)}
		</div>
	);
}
