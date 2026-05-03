"use client";

import { FaXmark, FaTriangleExclamation } from "react-icons/fa6";
import type { Client } from "@/types";

interface DeleteClientModalProps {
	client: Client;
	deleting: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function DeleteClientModal({ client, deleting, onConfirm, onCancel }: DeleteClientModalProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center" onClick={(e) => e.target === e.currentTarget && onCancel()}>
			<div className="w-full rounded-t-2xl bg-[#0F172A] p-6 sm:max-w-md sm:rounded-2xl">
				{/* Header */}
				<div className="mb-5 flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
							<FaTriangleExclamation className="text-red-400" />
						</div>
						<h2 className="text-base font-semibold">Supprimer le client</h2>
					</div>

					<button onClick={onCancel} className="rounded-lg border border-white/10 p-1.5 text-gray-400 transition hover:bg-white/10">
						<FaXmark size={13} />
					</button>
				</div>

				{/* Content */}
				<div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
					<p className="font-medium">{client.name}</p>
					<p className="mt-0.5 text-xs text-gray-400">{client.email}</p>
					{client.phone && <p className="mt-0.5 text-xs text-gray-500">{client.phone}</p>}
				</div>

				<p className="mb-6 text-sm text-gray-400">
					Cette action est <span className="font-medium text-white">irréversible</span>.
				</p>

				{/* Actions */}
				<div className="flex gap-3">
					<button onClick={onCancel} disabled={deleting} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-gray-300 hover:bg-white/10 disabled:opacity-50">
						Annuler
					</button>

					<button onClick={onConfirm} disabled={deleting} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50">
						{deleting ? "Suppression..." : "Supprimer"}
					</button>
				</div>
			</div>
		</div>
	);
}
