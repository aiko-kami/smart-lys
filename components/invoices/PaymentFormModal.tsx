"use client";

import { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { LuBuilding2, LuCreditCard, LuFileText, LuLandmark } from "react-icons/lu";
import toast from "react-hot-toast";
import type { Payment } from "@/types";
import Modal from "@/components/ui/Modal";

interface Props {
	open: boolean;
	payment?: Payment | null;
	onClose: () => void;
	onSaved?: (payment: Payment) => void;
}

/**
 * IMPORTANT:
 * Form state = version "safe UI"
 * => tous les champs sont obligatoires côté front
 */
const defaultForm: Payment = {
	name: "",
	bank: "",
	iban: "",
	bic: "",
	description: "",
	paymentTerms: "",
};

export default function PaymentFormModal({ open, payment, onClose, onSaved }: Props) {
	const [form, setForm] = useState<Payment>(defaultForm);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// hydrate form when editing
	useEffect(() => {
		if (payment) {
			setForm({
				name: payment.name ?? "",
				bank: payment.bank ?? "",
				iban: payment.iban ?? "",
				bic: payment.bic ?? "",
				description: payment.description ?? "",
				paymentTerms: payment.paymentTerms ?? "",
			});
		} else {
			setForm(defaultForm);
		}
	}, [payment, open]);

	function updateField<K extends keyof Payment>(key: K, value: Payment[K]) {
		setForm((prev) => ({
			...prev,
			[key]: value,
		}));
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setSaving(true);
		setError(null);

		try {
			const isEdit = !!payment?._id;

			const res = await fetch("/api/invoices/payments", {
				method: isEdit ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			if (!res.ok) {
				throw new Error("Erreur lors de la mise à jour des informations de paiement");
			}

			const saved: Payment = await res.json();

			onSaved?.(saved);
			toast.success("Informations de paiement mises à jour");
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour des informations de paiement");
			toast.error(err instanceof Error ? err.message : "Erreur lors de la mise à jour des informations de paiement");
		} finally {
			setSaving(false);
		}
	}

	if (!open) return null;

	return (
		<Modal open={open} onClose={onClose}>
			<div className="w-full min-w-[320px] sm:min-w-[650px] max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">
				{/* HEADER */}
				<div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
					<div>
						<h2 className="text-2xl font-semibold text-white">{payment ? "Modifier les informations de paiement" : "Ajouter des informations de paiement"}</h2>

						<p className="mt-1 text-sm text-gray-400">Ces informations apparaîtront sur vos factures clients.</p>
					</div>

					<button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-gray-400 transition hover:bg-white/10 hover:text-white">
						<FaXmark />
					</button>
				</div>

				{/* BODY */}
				<form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
					<div className="grid gap-4 sm:grid-cols-2">
						<Input label="Nom / Société" icon={<LuBuilding2 size={16} />} value={form.name} onChange={(v) => updateField("name", v)} required />

						<Input label="Banque" icon={<LuLandmark size={16} />} value={form.bank} onChange={(v) => updateField("bank", v)} />
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<Input label="IBAN" icon={<LuCreditCard size={16} />} value={form.iban} onChange={(v) => updateField("iban", v)} />

						<Input label="BIC / SWIFT" icon={<LuCreditCard size={16} />} value={form.bic} onChange={(v) => updateField("bic", v)} />
					</div>

					<Textarea label="Description" value={form.description} onChange={(v) => updateField("description", v)} placeholder="Informations complémentaires..." />

					<Textarea label="Conditions de paiement" value={form.paymentTerms} onChange={(v) => updateField("paymentTerms", v)} placeholder="Exemple : Paiement sous 7 jours." />

					{/* FOOTER */}
					<div className="flex items-center justify-end gap-3 border-t border-white/10 pt-5">
						<button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10">
							Annuler
						</button>

						<button type="submit" disabled={saving} className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50">
							{saving ? "Enregistrement..." : "Enregistrer"}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
}

/* ───────────────────────── INPUT ───────────────────────── */

function Input({ label, value, onChange, icon, required }: { label: string; value: string; onChange: (value: string) => void; icon?: React.ReactNode; required?: boolean }) {
	return (
		<div>
			<label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
				{icon}
				{label}
			</label>

			<input
				value={value}
				required={required}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500"
			/>
		</div>
	);
}

/* ───────────────────────── TEXTAREA ───────────────────────── */

function Textarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
	return (
		<div>
			<label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
				<LuFileText size={16} />
				{label}
			</label>

			<textarea
				rows={4}
				value={value}
				placeholder={placeholder}
				onChange={(e) => onChange(e.target.value)}
				className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500"
			/>
		</div>
	);
}
