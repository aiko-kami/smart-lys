"use client";

import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import Field from "@/components/ui/Field";
import type { Invoice, Client, InvoiceLine } from "@/types";
import { INPUT_CLASS } from "@/utils";

// ── Types ─────────────────────────────────────────────

interface InvoiceFormModalProps {
	invoice: Invoice | null;
	clients: Client[];
	onClose: () => void;
	onSave: (data: Partial<Invoice>) => Promise<void>;
}

// ── Component ─────────────────────────────────────────

export default function InvoiceFormModal({ invoice, clients = [], onClose, onSave }: InvoiceFormModalProps) {
	const [saving, setSaving] = useState(false);

	const [form, setForm] = useState({
		number: invoice?.number ?? "",
		clientId: invoice?.clientId ? (typeof invoice.clientId === "string" ? invoice.clientId : invoice.clientId._id) : "",
		date: invoice?.date ? invoice.date.slice(0, 10) : "",
		dueDate: invoice?.dueDate ? invoice.dueDate.slice(0, 10) : "",
		status: invoice?.status ?? "draft",
		lines: invoice?.lines ?? ([] as InvoiceLine[]),
	});

	function set<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
		setForm((prev) => ({
			...prev,
			[field]: value,
		}));
	}

	// ── Lines (simple version) ──
	function addLine() {
		setForm((prev) => ({
			...prev,
			lines: [...prev.lines, { description: "", quantity: 1, unitPrice: 0, total: 0 }],
		}));
	}

	function updateLine(index: number, key: keyof InvoiceLine, value: any) {
		setForm((prev) => {
			const updated = [...prev.lines];
			updated[index] = {
				...updated[index],
				[key]: value,
			};

			// recalcul total
			updated[index].total = updated[index].quantity * updated[index].unitPrice;

			return { ...prev, lines: updated };
		});
	}

	function removeLine(index: number) {
		setForm((prev) => ({
			...prev,
			lines: prev.lines.filter((_, i) => i !== index),
		}));
	}

	// ── Submit ──
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSaving(true);

		try {
			await onSave(form);
			onClose();
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center" onClick={(e) => e.target === e.currentTarget && onClose()}>
			<div className="w-full max-h-[90vh] overflow-y-auto rounded-t-2xl bg-[#0F172A] p-6 sm:max-w-2xl sm:rounded-2xl">
				{/* Header */}
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-lg font-semibold">{invoice ? "Modifier la facture" : "Nouvelle facture"}</h2>

					<button onClick={onClose} className="rounded-lg border border-white/10 p-2 text-gray-400 hover:bg-white/10">
						<FaXmark />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Number + Client */}
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field label="Numéro">
							<input value={form.number} onChange={(e) => set("number", e.target.value)} className={INPUT_CLASS} placeholder="INV-001" />
						</Field>

						<Field label="Client">
							<select value={form.clientId} onChange={(e) => set("clientId", e.target.value)} className={INPUT_CLASS}>
								<option value="">Choisir un client</option>
								{clients.map((c) => (
									<option key={c._id} value={c._id}>
										{c.name}
									</option>
								))}
							</select>
						</Field>
					</div>

					{/* Dates */}
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field label="Date">
							<input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={INPUT_CLASS} />
						</Field>

						<Field label="Échéance">
							<input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} className={INPUT_CLASS} />
						</Field>
					</div>

					{/* Status */}
					<Field label="Statut">
						<select value={form.status} onChange={(e) => set("status", e.target.value as any)} className={INPUT_CLASS}>
							<option value="draft">Brouillon</option>
							<option value="sent">Envoyée</option>
							<option value="paid">Payée</option>
						</select>
					</Field>

					{/* Lines */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-medium text-gray-300">Lignes</h3>
							<button type="button" onClick={addLine} className="text-xs text-blue-400 hover:underline">
								+ Ajouter
							</button>
						</div>

						{form.lines.map((line, i) => (
							<div key={i} className="grid grid-cols-12 gap-2 items-center">
								<input className={`${INPUT_CLASS} col-span-5`} placeholder="Description" value={line.description} onChange={(e) => updateLine(i, "description", e.target.value)} />

								<input type="number" className={`${INPUT_CLASS} col-span-2`} value={line.quantity} onChange={(e) => updateLine(i, "quantity", Number(e.target.value))} />

								<input type="number" className={`${INPUT_CLASS} col-span-2`} value={line.unitPrice} onChange={(e) => updateLine(i, "unitPrice", Number(e.target.value))} />

								<div className="col-span-2 text-xs text-gray-400">{line.total} €</div>

								<button type="button" onClick={() => removeLine(i)} className="col-span-1 text-red-400 text-xs">
									X
								</button>
							</div>
						))}
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-2">
						<button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-gray-300 hover:bg-white/10">
							Annuler
						</button>

						<button type="submit" disabled={saving} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50">
							{saving ? "Enregistrement..." : invoice ? "Modifier" : "Créer"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
