"use client";

import { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";

import Modal from "@/components/ui/Modal";
import type { ClientDetailsModalProps } from "@/types/modal";

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex items-start justify-between gap-4 py-3">
			<span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
			<div className="text-sm text-right text-white wrap-break-word max-w-[60%]">{children || "—"}</div>
		</div>
	);
}

export default function ClientDetailsModal({ client, onClose, onEdit, onDelete }: ClientDetailsModalProps) {
	// ESC close
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [onClose]);

	if (!client) return null;

	return (
		<Modal open={!!client} onClose={onClose}>
			{/* HEADER */}
			<div className="flex items-start justify-between border-b border-white/10 p-6">
				<div>
					<h2 className="text-xl font-semibold">{client.name}</h2>
					<p className="mt-1 text-sm text-gray-400">{client.email || "—"}</p>
				</div>

				<button onClick={onClose} className="rounded-lg border border-white/10 p-1.5 text-gray-400 transition hover:bg-white/10">
					<FaXmark size={16} />
				</button>
			</div>

			{/* CONTENT */}
			<div className="p-6 divide-y divide-white/5 md:min-w-lg">
				<InfoRow label="Téléphone">{client.phone}</InfoRow>

				<InfoRow label="Adresse">{client.address}</InfoRow>

				<InfoRow label="Date de début">{client.startDate ? new Date(client.startDate).toLocaleDateString("fr-FR") : "—"}</InfoRow>

				{/* DESCRIPTION */}
				<div className="py-3 space-y-2">
					<p className="text-xs uppercase tracking-wide text-gray-500">Description</p>
					<p className="text-sm text-gray-300 leading-relaxed">{client.description || "Aucune description"}</p>
				</div>

				{/* ID */}
				<div className="py-3 space-y-2">
					<p className="text-xs uppercase tracking-wide text-gray-500">ID</p>
					<p className="text-sm text-gray-400 break-all">{client._id}</p>
				</div>
			</div>

			{/* ACTIONS */}
			<div className="flex justify-end gap-2 border-t border-white/10 p-4">
				<button onClick={() => onDelete(client)} className="rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
					Supprimer
				</button>

				<button onClick={() => onEdit(client)} className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10">
					Éditer
				</button>
			</div>
		</Modal>
	);
}
