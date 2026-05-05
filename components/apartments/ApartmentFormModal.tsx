"use client";

import { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";

import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";
import type { Apartment, ClientRef } from "@/types";
import { INPUT_CLASS } from "@/utils/constants";
import { ApartmentFormModalProps } from "@/types/modal";

export default function ApartmentFormModal({ apartment, onClose, onSave }: ApartmentFormModalProps) {
	const [clients, setClients] = useState<ClientRef[]>([]);
	const [saving, setSaving] = useState(false);

	const [form, setForm] = useState({
		name: apartment?.name ?? "",
		address: apartment?.address ?? "",
		clientId: apartment?.clientId ? (typeof apartment.clientId === "string" ? apartment.clientId : apartment.clientId._id) : "",
		platform: apartment?.platform ?? "airbnb",
		airbnbIcalUrl: apartment?.airbnbIcalUrl ?? "",
		keys: apartment?.keys ?? "",
		floor: apartment?.floor ?? "",
		description: apartment?.description ?? "",
	});

	useEffect(() => {
		fetch("/api/clients")
			.then((r) => r.json())
			.then((data) => setClients(data ?? []));
	}, []);

	function set<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
		setForm((prev) => ({ ...prev, [field]: value }));
	}

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
		<Modal open={true} onClose={onClose}>
			<div className="w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0F172A] p-6 sm:max-w-lg">
				{/* HEADER */}
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-lg font-semibold">{apartment ? "Modifier l'appartement" : "Nouvel appartement"}</h2>

					<button onClick={onClose} className="rounded-lg border border-white/10 p-2 text-gray-400 hover:bg-white/10">
						<FaXmark size={16} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Field label="Nom de l'appartement *">
						<input required value={form.name} onChange={(e) => set("name", e.target.value)} className={INPUT_CLASS} />
					</Field>

					<Field label="Adresse *">
						<input required value={form.address} onChange={(e) => set("address", e.target.value)} className={INPUT_CLASS} />
					</Field>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field label="Client *">
							<select required value={form.clientId} onChange={(e) => set("clientId", e.target.value)} className={INPUT_CLASS}>
								<option value="">Sélectionner...</option>
								{clients.map((c) => (
									<option key={c._id} value={c._id}>
										{c.name}
									</option>
								))}
							</select>
						</Field>

						<Field label="Plateforme">
							<select value={form.platform} onChange={(e) => set("platform", e.target.value as "airbnb" | "other")} className={INPUT_CLASS}>
								<option value="airbnb">Airbnb</option>
								<option value="other">Autre</option>
							</select>
						</Field>
					</div>

					<Field label="Description">
						<textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className={`${INPUT_CLASS} resize-none`} />
					</Field>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field label="Étage">
							<input value={form.floor} onChange={(e) => set("floor", e.target.value)} className={INPUT_CLASS} />
						</Field>

						<Field label="Clés">
							<input value={form.keys} onChange={(e) => set("keys", e.target.value)} className={INPUT_CLASS} />
						</Field>
					</div>

					{form.platform === "airbnb" && (
						<Field label="URL iCal Airbnb">
							<input type="url" value={form.airbnbIcalUrl} onChange={(e) => set("airbnbIcalUrl", e.target.value)} className={INPUT_CLASS} />
						</Field>
					)}

					{/* ACTIONS */}
					<div className="flex gap-3 pt-6">
						<button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm">
							Annuler
						</button>

						<button type="submit" disabled={saving} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white">
							{saving ? "..." : apartment ? "Enregistrer" : "Créer"}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
