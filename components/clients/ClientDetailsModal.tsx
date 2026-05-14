"use client";

import { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";

import Modal from "@/components/ui/Modal";
import type { ClientDetailsModalProps } from "@/types/modal";
import { RemoveButton, EditButton } from "@/components/buttons/Buttons";

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex items-start justify-between gap-4 py-3">
			<span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
			<div className="max-w-[60%] text-right text-sm wrap-break-word">{children ? <span className="text-white">{children}</span> : <span className="text-gray-500">—</span>}</div>
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
					{client.email ? (
						<p className="mt-1 text-sm text-gray-300">
							<a href={`mailto:${client.email}`} className="hover:underline hover:text-white">
								{client.email}
							</a>
						</p>
					) : (
						<p className="text-center text-sm text-gray-500">—</p>
					)}
				</div>

				<button onClick={onClose} className="rounded-lg border border-white/10 p-1.5 text-gray-400 transition hover:bg-white/10">
					<FaXmark size={16} />
				</button>
			</div>

			{/* CONTENT */}
			<div className="p-6 divide-y divide-white/5 md:min-w-lg">
				<InfoRow label="Téléphone">
					<a href={`tel:${client.phone}`} className="text-blue-400 hover:underline">
						{client.phone}
					</a>
				</InfoRow>

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

			{/* ── FOOTER ── */}
			<div className="mt-4 flex items-center justify-end gap-4 border-t border-white/5 px-6 py-4">
				<RemoveButton action={() => onDelete(client)} btnSize="sm" />
				<EditButton action={() => onEdit(client)} btnSize="sm" />
			</div>
		</Modal>
	);
}
