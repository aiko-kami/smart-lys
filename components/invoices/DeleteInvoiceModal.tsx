"use client";

import { FaTriangleExclamation, FaXmark } from "react-icons/fa6";

import Modal from "@/components/ui/Modal";
import type { Invoice } from "@/types";

interface DeleteInvoiceModalProps {
	invoice: Invoice;
	deleting: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function DeleteInvoiceModal({ invoice, deleting, onConfirm, onCancel }: DeleteInvoiceModalProps) {
	function getClientName() {
		if (!invoice.clientId) return "Client inconnu";
		if (typeof invoice.clientId === "string") return "Client inconnu";
		return invoice.clientId.name ?? "Client inconnu";
	}

	return (
		<Modal open={!!invoice} onClose={onCancel}>
			<div className="w-full sm:max-w-md rounded-2xl bg-[#0F172A] p-6">
				{/* HEADER */}
				<div className="mb-5 flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
							<FaTriangleExclamation className="text-red-400" />
						</div>

						<h2 className="text-base font-semibold">Supprimer la facture</h2>
					</div>

					<button onClick={onCancel} className="rounded-lg border border-white/10 p-1.5 text-gray-400 hover:bg-white/10">
						<FaXmark size={13} />
					</button>
				</div>

				{/* INVOICE INFO */}
				<div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
					<p className="font-medium">{invoice.number}</p>

					<p className="mt-0.5 text-xs text-gray-400">{new Date(invoice.date).toLocaleDateString("fr-FR")}</p>

					<p className="mt-0.5 text-xs text-gray-500">Client : {getClientName()}</p>

					<p className="mt-1 text-xs text-gray-400">Total : {invoice.total} €</p>
				</div>

				{/* WARNING */}
				<p className="mb-6 text-sm text-gray-400">
					Cette action est <span className="font-medium text-white">irréversible</span>. La facture sera supprimée définitivement.
				</p>

				{/* ACTIONS */}
				<div className="flex gap-3">
					<button onClick={onCancel} disabled={deleting} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-gray-300 hover:bg-white/10 disabled:opacity-50">
						Annuler
					</button>

					<button onClick={onConfirm} disabled={deleting} className="flex-1 rounded-xl bg-red-700 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50">
						{deleting ? "Suppression..." : "Supprimer"}
					</button>
				</div>
			</div>
		</Modal>
	);
}
