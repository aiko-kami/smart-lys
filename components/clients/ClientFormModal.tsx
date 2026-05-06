"use client";

import { useState } from "react";
import { FaXmark } from "react-icons/fa6";

import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";
import type { ClientFormModalProps } from "@/types/modal";
import { INPUT_CLASS } from "@/utils";

export default function ClientFormModal({ client, onClose, onSave }: ClientFormModalProps) {
	const [saving, setSaving] = useState(false);

	const [form, setForm] = useState({
		name: client?.name ?? "",
		email: client?.email ?? "",
		phone: client?.phone ?? "",
		address: client?.address ?? "",
		description: client?.description ?? "",
		startDate: client?.startDate ? new Date(client.startDate).toISOString().split("T")[0] : "",
	});

	function set<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
		setForm((prev) => ({
			...prev,
			[field]: value,
		}));
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
		<Modal open={true} onClose={onClose} closeOnBackdrop={false}>
			<div className="w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0F172A] p-6 sm:min-w-2xl">
				{/* HEADER */}
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-lg font-semibold">{client ? "Modifier le client" : "Nouveau client"}</h2>

					<button onClick={onClose} className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:bg-white/10">
						<FaXmark size={16} />
					</button>
				</div>

				{/* FORM */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Name + Email */}
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field label="Nom complet *">
							<input required type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jessica Dupont" className={INPUT_CLASS} />
						</Field>

						<Field label="Email">
							<input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="contact@email.com" className={INPUT_CLASS} />
						</Field>
					</div>

					{/* Phone + Address */}
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field label="Téléphone">
							<input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+33 6 01 02 03 04" className={INPUT_CLASS} />
						</Field>

						<Field label="Adresse">
							<input type="text" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="2 rue Gambetta, 06160 Antibes" className={INPUT_CLASS} />
						</Field>
					</div>

					{/* Start date */}
					<Field label="Client depuis">
						<input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className={INPUT_CLASS} />
					</Field>

					{/* Description */}
					<Field label="Description">
						<textarea
							rows={3}
							value={form.description}
							onChange={(e) => set("description", e.target.value)}
							placeholder="Notes ou informations complémentaires sur le client..."
							className={`${INPUT_CLASS} resize-none`}
						/>
					</Field>

					{/* ACTIONS */}
					<div className="flex gap-3 pt-2">
						<button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-gray-300 transition hover:bg-white/10">
							Annuler
						</button>

						<button type="submit" disabled={saving} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50">
							{saving ? "Enregistrement..." : client ? "Enregistrer" : "Créer"}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
