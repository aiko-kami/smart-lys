"use client";

import { FaTriangleExclamation, FaXmark } from "react-icons/fa6";
import { DeleteApartmentModalProps } from "@/types";

export default function DeleteModal({ apartment, deleting, onConfirm, onCancel }: DeleteApartmentModalProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center" onClick={(e) => e.target === e.currentTarget && onCancel()}>
			<div className="w-full rounded-t-2xl bg-[#0F172A] p-6 sm:max-w-md sm:rounded-2xl">
				<div className="mb-5 flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
							<FaTriangleExclamation className="text-red-400" />
						</div>
						<h2 className="text-base font-semibold">Supprimer l'appartement</h2>
					</div>

					<button onClick={onCancel} className="rounded-lg border border-white/10 p-1.5 text-gray-400 hover:bg-white/10">
						<FaXmark size={13} />
					</button>
				</div>

				<div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
					<p className="font-medium">{apartment.name}</p>
					<p className="mt-0.5 text-xs text-gray-400">{apartment.address}</p>
					<p className="mt-0.5 text-xs text-gray-500">Client : {apartment.clientId?.name}</p>
				</div>

				<p className="mb-6 text-sm text-gray-400">
					Cette action est <span className="font-medium text-white">irréversible</span>.
				</p>

				<div className="flex gap-3">
					<button onClick={onCancel} disabled={deleting} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-gray-300 hover:bg-white/10">
						Annuler
					</button>

					<button onClick={onConfirm} disabled={deleting} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm text-white hover:bg-red-500">
						{deleting ? "Suppression..." : "Supprimer"}
					</button>
				</div>
			</div>
		</div>
	);
}
