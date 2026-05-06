"use client";

import { useState, useMemo } from "react";
import { FaXmark } from "react-icons/fa6";

import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";
import type { InvoiceLine } from "@/types";
import { INPUT_CLASS } from "@/utils";
import { InvoiceFormModalProps } from "@/types/modal";

export default function InvoiceFormModal({ invoice, clients = [], onClose, onSave }: InvoiceFormModalProps) {
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const [form, setForm] = useState({
		number: invoice?.number ?? "",
		clientId: typeof invoice?.clientId === "string" ? invoice.clientId : (invoice?.clientId?._id ?? ""),
		date: invoice?.date ? invoice.date.slice(0, 10) : "",
		dueDate: invoice?.dueDate ? invoice.dueDate.slice(0, 10) : "",
		status: invoice?.status ?? "draft",
		lines: invoice?.lines ?? ([] as InvoiceLine[]),
	});

	// ── TOTAL ─────────────────────────────
	const total = useMemo(() => {
		return form.lines.reduce((sum, l) => sum + (l.quantity * l.unitPrice || 0), 0);
	}, [form.lines]);

	function set<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
		setForm((prev) => ({ ...prev, [field]: value }));
	}

	// ── VALIDATION ─────────────────────────────
	function validate() {
		const newErrors: Record<string, string> = {};

		if (!form.number.trim()) newErrors.number = "Le numéro est requis";
		if (!form.clientId) newErrors.clientId = "Le client est requis";
		if (!form.date) newErrors.date = "La date est requise";
		if (form.lines.length === 0) newErrors.lines = "Ajoute au moins une ligne";

		form.lines.forEach((l, i) => {
			if (!l.description.trim()) newErrors[`line-${i}-description`] = "Description requise";
			if (l.quantity <= 0) newErrors[`line-${i}-quantity`] = "Quantité invalide";
			if (l.unitPrice <= 0) newErrors[`line-${i}-unitPrice`] = "Prix invalide";
		});

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	// ── LINES ─────────────────────────────
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

	// ── SUBMIT ─────────────────────────────
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		if (!validate()) {
			setError("Merci de corriger les erreurs du formulaire");
			return;
		}

		setSaving(true);

		try {
			await onSave({
				...form,
				total,
			});
			onClose();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Erreur lors de l'enregistrement");
		} finally {
			setSaving(false);
		}
	}

	// ── UI ─────────────────────────────
	return (
		<Modal open={!!invoice || true} onClose={onClose} closeOnBackdrop={false}>
			<div className="w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0F172A] p-6 sm:min-w-2xl">
				{/* HEADER */}
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-lg font-semibold">{invoice ? "Modifier la facture" : "Nouvelle facture"}</h2>

					<button onClick={onClose} className="rounded-lg border border-white/10 p-2 text-gray-400 hover:bg-white/10">
						<FaXmark size={16} />
					</button>
				</div>

				{/* ERROR */}
				{error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>}

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* NUMBER + CLIENT */}
					<div className="grid grid-cols-2 gap-4">
						<Field label="Numéro">
							<input value={form.number} onChange={(e) => set("number", e.target.value)} className={INPUT_CLASS} />
							{errors.number && <p className="text-xs text-red-400">{errors.number}</p>}
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
							{errors.clientId && <p className="text-xs text-red-400">{errors.clientId}</p>}
						</Field>
					</div>

					{/* DATES */}
					<div className="grid grid-cols-2 gap-4">
						<Field label="Date">
							<input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={INPUT_CLASS} />
							{errors.date && <p className="text-xs text-red-400">{errors.date}</p>}
						</Field>

						<Field label="Échéance">
							<input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} className={INPUT_CLASS} />
						</Field>
					</div>

					{/* STATUS */}
					<Field label="Statut">
						<select value={form.status} onChange={(e) => set("status", e.target.value as any)} className={INPUT_CLASS}>
							<option value="draft">Brouillon</option>
							<option value="sent">Envoyée</option>
							<option value="paid">Payée</option>
							<option value="late">En retard</option>
						</select>
					</Field>

					{/* LINES */}
					<div className="space-y-3">
						<div className="flex justify-between">
							<h3 className="text-sm text-gray-300">Lignes</h3>
							<button type="button" onClick={addLine} className="text-xs text-blue-400">
								+ Ajouter
							</button>
						</div>
						{errors.lines && <p className="text-xs text-red-400">{errors.lines}</p>}

						{form.lines.map((line, i) => (
							<div key={i}>
								<div className="grid grid-cols-12 gap-2">
									<input className={`${INPUT_CLASS} col-span-5`} value={line.description} onChange={(e) => updateLine(i, "description", e.target.value)} />

									<input type="number" className={`${INPUT_CLASS} col-span-2`} value={line.quantity} onChange={(e) => updateLine(i, "quantity", Number(e.target.value))} />

									<input type="number" className={`${INPUT_CLASS} col-span-2`} value={line.unitPrice} onChange={(e) => updateLine(i, "unitPrice", Number(e.target.value))} />

									<div className="col-span-2 text-xs text-gray-400">{line.total} €</div>

									<button type="button" onClick={() => removeLine(i)} className="col-span-1 text-red-400">
										×
									</button>
								</div>
								<div className="">
									{errors[`line-${i}-description`] && <p className="text-xs text-red-400">{errors[`line-${i}-description`]}</p>}
									{errors[`line-${i}-quantity`] && <p className="text-xs text-red-400">{errors[`line-${i}-quantity`]}</p>}
									{errors[`line-${i}-unitPrice`] && <p className="text-xs text-red-400">{errors[`line-${i}-unitPrice`]}</p>}
								</div>
							</div>
						))}
					</div>

					{/* TOTAL */}
					<div className="flex justify-end border-t border-white/10 pt-4">
						<div className="text-right">
							<p className="text-xs text-gray-400">Total</p>
							<p className="text-lg font-semibold">{total.toFixed(2)} €</p>
						</div>
					</div>

					{/* ACTIONS */}
					<div className="flex gap-3">
						<button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm">
							Annuler
						</button>

						<button type="submit" disabled={saving} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white">
							{saving ? "Enregistrement..." : invoice ? "Modifier" : "Créer"}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
