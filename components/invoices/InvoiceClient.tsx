"use client";

import { useState, useMemo } from "react";
import type { Invoice, Client } from "@/types";
import { formatDate } from "@/utils/invoice";
import { filterInvoices } from "@/utils/invoiceFilters";
import InvoiceStatusBadge from "@/components/ui/InvoiceStatusBadge";
import InvoiceFormModal from "@/components/invoices/InvoiceFormModal";

export default function InvoiceClient({ invoices: initial, clients }: { invoices: Invoice[]; clients: Client[] }) {
	const [invoices] = useState(initial);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	// ── Modal state ──
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

	const filtered = useMemo(() => {
		return filterInvoices(invoices, search, statusFilter);
	}, [invoices, search, statusFilter]);

	// ── Actions ──
	function handleCreate() {
		setSelectedInvoice(null);
		setModalOpen(true);
	}

	function handleEdit(inv: Invoice) {
		setSelectedInvoice(inv);
		setModalOpen(true);
	}

	async function handleSave(data: Partial<Invoice>) {
		// TODO: API call
		console.log("SAVE INVOICE", data);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold">Factures</h1>
					<p className="text-gray-400">{invoices.length} factures</p>
				</div>

				<button onClick={handleCreate} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
					+ Nouvelle facture
				</button>
			</div>

			{/* Filters */}
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
			</div>

			{/* Table */}
			<div className="overflow-y-auto rounded-2xl border border-white/10 bg-[#111827]">
				<table className="w-full">
					<thead>
						<tr className="border-b border-white/10 text-xs text-gray-500 uppercase">
							<th className="px-5 py-3 text-left">Client</th>
							<th className="px-5 py-3 text-center">n°</th>
							<th className="px-5 py-3 text-center">Date</th>
							<th className="px-5 py-3 text-center">Montant</th>
							<th className="px-5 py-3 text-center">Statut</th>
							<th className="px-5 py-3 text-center">Actions</th>
						</tr>
					</thead>

					<tbody>
						{filtered.map((inv) => (
							<tr key={inv._id} className="border-b border-white/10">
								<td className="px-5 py-4">{typeof inv.clientId === "string" ? "Client inconnu" : (inv.clientId?.name ?? "Client inconnu")}</td>

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

										<button className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">Supprimer</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Modal */}
			{modalOpen && <InvoiceFormModal invoice={selectedInvoice} clients={clients} onClose={() => setModalOpen(false)} onSave={handleSave} />}
		</div>
	);
}
