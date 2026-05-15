"use client";

import { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";

import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";

import type { Task } from "@/types";
import type { TaskFormModalProps } from "@/types/modal";

import { INPUT_CLASS } from "@/utils";

export default function TaskFormModal({ task, onClose, onSave, clients = [], apartments = [] }: TaskFormModalProps) {
	const [saving, setSaving] = useState(false);

	const [form, setForm] = useState({
		title: task?.title ?? "",
		description: task?.description ?? "",
		notes: task?.notes ?? "",
		type: task?.type ?? "other",
		status: task?.status ?? "pending",
		priority: task?.priority ?? "medium",
		dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
		startDate: task?.startDate ? new Date(task.startDate).toISOString().split("T")[0] : "",
		duration: task?.duration ?? 0,
		clientId: typeof task?.clientId === "object" ? task.clientId?._id : (task?.clientId ?? ""),
		apartmentId: typeof task?.apartmentId === "object" ? task.apartmentId?._id : (task?.apartmentId ?? ""),
	});

	useEffect(() => {
		if (!form.clientId) return;

		const filtered = apartments.filter((apartment) => {
			const clientId = typeof apartment.clientId === "object" ? apartment.clientId?._id : apartment.clientId;

			return clientId === form.clientId;
		});

		if (filtered.length === 0) return;

		setForm((prev) => ({
			...prev,
			apartmentId: filtered[0]._id,
		}));
	}, [form.clientId, apartments, task]);

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

	const filteredApartments = (apartments ?? []).filter((apartment) => {
		const clientId = typeof apartment.clientId === "object" ? apartment.clientId?._id : apartment.clientId;

		return clientId === form.clientId;
	});

	return (
		<Modal open={true} onClose={onClose} closeOnBackdrop={false}>
			<div className="w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0F172A] p-6 sm:min-w-2xl">
				{/* HEADER */}
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-lg font-semibold">{task ? "Modifier la tâche" : "Nouvelle tâche"}</h2>

					<button onClick={onClose} className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:bg-white/10">
						<FaXmark size={16} />
					</button>
				</div>

				{/* FORM */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Title */}
					<Field label="Titre *">
						<input required type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Nettoyage appartement" className={INPUT_CLASS} />
					</Field>

					{/* Description */}
					<Field label="Description">
						<textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Description de la tâche..." className={`${INPUT_CLASS} resize-none`} />
					</Field>

					{/* Notes */}
					<Field label="Notes">
						<textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Notes complémentaires..." className={`${INPUT_CLASS} resize-none`} />
					</Field>

					{/* Type + Status */}
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field label="Type">
							<select value={form.type} onChange={(e) => set("type", e.target.value as Task["type"])} className={INPUT_CLASS}>
								<option value="cleaning">Nettoyage</option>
								<option value="checkin">Accueil voyageurs</option>
								<option value="checkout">Départ voyageurs</option>
								<option value="maintenance">Maintenance</option>
								<option value="inspection">Inspection</option>
								<option value="other">Autre</option>
							</select>
						</Field>

						<Field label="Statut">
							<select value={form.status} onChange={(e) => set("status", e.target.value as Task["status"])} className={INPUT_CLASS}>
								<option value="pending">En attente</option>
								<option value="in progress">En cours</option>
								<option value="done">Terminée</option>
								<option value="cancelled">Annulée</option>
								<option value="N/A">Non applicable</option>
							</select>
						</Field>
					</div>

					{/* Priority + Duration */}
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field label="Priorité">
							<select value={form.priority} onChange={(e) => set("priority", e.target.value as Task["priority"])} className={INPUT_CLASS}>
								<option value="low">Basse</option>
								<option value="medium">Moyenne</option>
								<option value="high">Haute</option>
								<option value="N/A">Non applicable</option>
							</select>
						</Field>

						<Field label="Durée (minutes)">
							<input type="number" value={form.duration} onChange={(e) => set("duration", Number(e.target.value))} placeholder="90" className={INPUT_CLASS} />
						</Field>
					</div>

					{/* Dates */}
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field label="Date limite *">
							<input required type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} className={INPUT_CLASS} />
						</Field>

						<Field label="Date de début">
							<input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className={INPUT_CLASS} />
						</Field>
					</div>

					{/* Client + Appartement */}
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field label="Client">
							<select
								value={form.clientId}
								onChange={(e) => {
									set("clientId", e.target.value);
									set("apartmentId", "");
								}}
								className={INPUT_CLASS}
							>
								<option value="">Sélectionner un client</option>

								{clients.map((client) => (
									<option key={client._id} value={client._id}>
										{client.name}
									</option>
								))}
							</select>
						</Field>

						<Field label="Appartement">
							<select value={form.apartmentId} onChange={(e) => set("apartmentId", e.target.value)} className={INPUT_CLASS} disabled={!form.clientId}>
								<option value="">Sélectionner un appartement</option>

								{filteredApartments.map((apartment) => (
									<option key={apartment._id} value={apartment._id}>
										{apartment.name}
									</option>
								))}
							</select>
						</Field>
					</div>

					{/* ACTIONS */}
					<div className="flex gap-3 pt-6">
						<button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-gray-300 transition hover:bg-white/10">
							Annuler
						</button>

						<button type="submit" disabled={saving} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50">
							{saving ? "Enregistrement..." : task ? "Enregistrer" : "Créer"}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
