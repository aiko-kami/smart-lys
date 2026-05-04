"use client";

import { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import type { Apartment, ClientRef } from "@/types";

interface Props {
	apartment: Apartment | null;
	onClose: () => void;
	onSave: (data: Partial<Apartment>) => Promise<void>;
}

export default function ApartmentFormModal({ apartment, onClose, onSave }: Props) {
	const [clients, setClients] = useState<ClientRef[]>([]);
	const [saving, setSaving] = useState(false);

	const [form, setForm] = useState({
		name: apartment?.name ?? "",
		address: apartment?.address ?? "",
		clientId: apartment?.clientId ? (typeof apartment.clientId === "string" ? apartment.clientId : apartment.clientId._id) : "",
		platform: apartment?.platform ?? "airbnb",
		airbnbIcalUrl: apartment?.airbnbIcalUrl ?? "",
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
		<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" onClick={(e) => e.target === e.currentTarget && onClose()}>
			<div className="w-full max-h-[90vh] overflow-y-auto rounded-t-2xl bg-[#0F172A] p-6 sm:max-w-lg sm:rounded-2xl">
				{/* Header */}
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-lg font-semibold">{apartment ? "Modifier l'appartement" : "Nouvel appartement"}</h2>

					<button onClick={onClose} className="rounded-lg border border-white/10 p-2 text-gray-400 hover:bg-white/10">
						<FaXmark />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Field label="Nom de l'appartement *">
						<input required type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Apt. Bord de mer" className={inputCls} />
					</Field>

					<Field label="Adresse *">
						<input required type="text" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="12 Bd du Littoral, Antibes" className={inputCls} />
					</Field>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field label="Client *">
							<select required value={form.clientId} onChange={(e) => set("clientId", e.target.value)} className={inputCls}>
								<option value="">Sélectionner...</option>
								{clients.map((c) => (
									<option key={c._id} value={c._id}>
										{c.name}
									</option>
								))}
							</select>
						</Field>

						<Field label="Plateforme">
							<select value={form.platform} onChange={(e) => set("platform", e.target.value as "airbnb" | "other")} className={inputCls}>
								<option value="airbnb">Airbnb</option>
								<option value="other">Autre</option>
							</select>
						</Field>
					</div>

					{form.platform === "airbnb" && (
						<Field label="URL iCal Airbnb">
							<input type="url" value={form.airbnbIcalUrl} onChange={(e) => set("airbnbIcalUrl", e.target.value)} placeholder="https://www.airbnb.com/calendar/ical/..." className={inputCls} />
							<p className="mt-1 text-xs text-gray-500">Airbnb → Calendrier → Exporter → Copier le lien</p>
						</Field>
					)}

					<Field label="Description">
						<textarea
							rows={3}
							value={form.description}
							onChange={(e) => set("description", e.target.value)}
							placeholder="Notes ou informations complémentaires..."
							className={`${inputCls} resize-none`}
						/>
					</Field>

					{/* Actions */}
					<div className="flex gap-3 pt-2">
						<button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-gray-300 hover:bg-white/10">
							Annuler
						</button>

						<button type="submit" disabled={saving} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50">
							{saving ? "Enregistrement..." : apartment ? "Enregistrer" : "Créer"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div>
			<label className="mb-1.5 block text-xs font-medium text-gray-400">{label}</label>
			{children}
		</div>
	);
}

const inputCls = "w-full rounded-xl border border-white/10 bg-[#1a2438] px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition focus:border-blue-500";
