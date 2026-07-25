"use client";

import { useState, useMemo } from "react";
import { FaXmark, FaChevronUp, FaChevronDown } from "react-icons/fa6";

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
		title: invoice?.title ?? "",
		removeName: invoice?.removeName ?? false,
		date: invoice?.date ? invoice.date.slice(0, 10) : "",
		dueDate: invoice?.dueDate ? invoice.dueDate.slice(0, 10) : "",
		status: invoice?.status ?? "draft",
		paymentMode: invoice?.paymentMode ?? "",
		lines: invoice?.lines ?? ([{ description: "", quantity: 1, unitPrice: 0, total: 0 }] as InvoiceLine[]),
	});

	// ── TOTAL ─────────────────────────────
	const total = useMemo(() => {
		const raw = form.lines.reduce((sum, l) => sum + (l.quantity * l.unitPrice || 0), 0);
		return Math.round(raw * 100) / 100;
	}, [form.lines]);

	function set<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
		setForm((prev) => ({ ...prev, [field]: value }));
		// Efface l'erreur du champ dès que l'utilisateur modifie
		if (field in errors) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[field as string];
				return next;
			});
		}
	}

	// ── VALIDATION ─────────────────────────────
	async function validate(): Promise<boolean> {
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

		const numberChanged = !invoice || invoice.number !== form.number.trim();

		if (form.number.trim() && numberChanged) {
			try {
				const res = await fetch(`/api/invoices/check-invoice-number?number=${encodeURIComponent(form.number.trim())}${invoice ? `&excludeId=${invoice._id}` : ""}`);
				const data = await res.json();

				if (data.exists) {
					newErrors.number = `Le numéro "${form.number.trim()}" est déjà utilisé`;
				}
			} catch {
				// En cas d'erreur on ne bloque pas la validation, mais on log l'erreur
				console.error("Erreur lors de la vérification du numéro de facture");
			}
		}

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
			updated[index] = { ...updated[index], [key]: value };
			updated[index].total = Math.round(updated[index].quantity * updated[index].unitPrice * 100) / 100;
			return { ...prev, lines: updated };
		});
	}

	function moveLine(index: number, direction: "up" | "down") {
		setForm((prev) => {
			const newIndex = direction === "up" ? index - 1 : index + 1;
			if (newIndex < 0 || newIndex >= prev.lines.length) return prev;

			const updated = [...prev.lines];
			[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

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
		setSaving(true);

		try {
			const valid = await validate();

			if (!valid) {
				setError("Merci de corriger les erreurs du formulaire");
				return;
			}

			await onSave({ ...form, total });
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
					{/* NUMBER + CLIENT + TITLE + REMOVE NAME */}
					<div className="grid grid-cols-2 gap-4">
						<Field label="Numéro *">
							<input value={form.number} onChange={(e) => set("number", e.target.value)} className={`${INPUT_CLASS} ${errors.number ? "border-red-500/50" : ""}`} />
							{errors.number && <p className="mt-1 text-xs text-red-400">{errors.number}</p>}
						</Field>

						<div className="space-y-2 relative">
							<Field label="Client *">
								<select value={form.clientId} onChange={(e) => set("clientId", e.target.value)} className={`${INPUT_CLASS} ${errors.clientId ? "border-red-500/50" : ""}`}>
									<option value="">Choisir un client</option>
									{clients.map((c) => (
										<option key={c._id} value={c._id}>
											{c.name}
										</option>
									))}
								</select>
								{errors.clientId && <p className="mt-1 text-xs text-red-400">{errors.clientId}</p>}
							</Field>
							<div className="absolute flex items-center justify-end gap-2 right-1.5">
								<label className="text-xs font-medium text-gray-400">Masquer le nom du client</label>
								<input type="checkbox" checked={form.removeName} onChange={(e) => set("removeName", e.target.checked)} className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded" />
							</div>
						</div>
					</div>
					<Field label="Intitulé">
						<input value={form.title} onChange={(e) => set("title", e.target.value)} className={INPUT_CLASS} placeholder="" />
					</Field>

					{/* DATES */}
					<div className="grid grid-cols-2 gap-4">
						<Field label="Date *">
							<input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={`${INPUT_CLASS} ${errors.date ? "border-red-500/50" : ""}`} />
							{errors.date && <p className="mt-1 text-xs text-red-400">{errors.date}</p>}
						</Field>

						<Field label="Échéance">
							<input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} className={INPUT_CLASS} />
						</Field>
					</div>

					{/* STATUS */}
					<Field label="Statut">
						<select value={form.status} onChange={(e) => set("status", e.target.value as any)} className={INPUT_CLASS}>
							<option value="draft">Brouillon</option>
							<option value="sent">Envoyé</option>
							<option value="paid">Payé</option>
							<option value="late">En retard</option>
						</select>
					</Field>

					{/* PAYMENT MODE */}
					<Field label="Mode de paiement">
						<input value={form.paymentMode} onChange={(e) => set("paymentMode", e.target.value)} className={INPUT_CLASS} placeholder="" />
					</Field>

					{/* LINES */}
					<div className="space-y-3">
						<div className="flex justify-between">
							<h3 className="text-sm text-gray-300">Lignes *</h3>
							<button type="button" onClick={addLine} className="text-xs text-blue-400">
								+ Ajouter
							</button>
						</div>
						{errors.lines && <p className="text-xs text-red-400">{errors.lines}</p>}

						{form.lines.map((line, i) => (
							<div key={i}>
								<div className="grid grid-cols-15 gap-2">
									<div className="col-span-1 flex flex-col items-center justify-center gap-0.5">
										<button type="button" onClick={() => moveLine(i, "up")} disabled={i === 0} className="text-gray-400 hover:text-white disabled:opacity-20 disabled:hover:text-gray-400">
											<FaChevronUp size={10} />
										</button>
										<button
											type="button"
											onClick={() => moveLine(i, "down")}
											disabled={i === form.lines.length - 1}
											className="text-gray-400 hover:text-white disabled:opacity-20 disabled:hover:text-gray-400"
										>
											<FaChevronDown size={10} />
										</button>
									</div>
									<input className={`${INPUT_CLASS} col-span-6`} value={line.description} onChange={(e) => updateLine(i, "description", e.target.value)} />
									<input type="number" className={`${INPUT_CLASS} col-span-2`} value={line.quantity} onChange={(e) => updateLine(i, "quantity", Number(e.target.value))} />
									<input type="number" className={`${INPUT_CLASS} col-span-2`} value={line.unitPrice} onChange={(e) => updateLine(i, "unitPrice", Number(e.target.value))} />
									<div className="col-span-2 flex items-center justify-center text-sm text-gray-300">{line.total} €</div>
									<button type="button" onClick={() => removeLine(i)} className="col-span-1 text-red-400">
										×
									</button>
								</div>
								<div>
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
						<button type="submit" disabled={saving} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white disabled:opacity-60">
							{saving ? "Vérification…" : invoice ? "Modifier" : "Créer"}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
