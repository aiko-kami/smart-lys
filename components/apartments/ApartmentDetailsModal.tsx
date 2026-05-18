"use client";

import { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";

import Modal from "@/components/ui/Modal";
import StatusBadge from "@/components/ui/StatusBadge";
import PlatformIcon from "@/components/ui/PlatformIcon";
import { ApartmentDetailsModalProps } from "@/types/modal";
import { RemoveButton, EditButton } from "@/components/buttons/Buttons";

function InfoRow({ label, children }: any) {
	return (
		<div className="flex items-center justify-between gap-4 py-3 min-h-14">
			<span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
			<div className="text-sm text-right text-gray-200">{children}</div>
		</div>
	);
}

export default function ApartmentDetailsModal({ apartment, onClose, onEdit, onDelete }: ApartmentDetailsModalProps) {
	// ESC close
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [onClose]);

	if (!apartment) return null;

	return (
		<Modal open={!!apartment} onClose={onClose}>
			{/* HEADER */}
			<div className="flex items-start justify-between border-b border-white/10 p-6 sm:min-w-2xl">
				<div>
					<h2 className="text-xl font-semibold">{apartment.name}</h2>
					<p className="mt-1 text-sm text-gray-400">{apartment.address}</p>
				</div>
				<button onClick={onClose} className="rounded-lg border border-white/10 p-1.5 text-gray-400 transition hover:bg-white/10">
					<FaXmark size={16} />
				</button>
			</div>

			{/* MOBILE */}
			<div className="grid grid-cols-1 divide-y divide-white/5 p-6 md:hidden">
				<InfoRow label="Client">{typeof apartment.clientId === "string" ? "—" : (apartment.clientId?.name ?? "—")}</InfoRow>

				<InfoRow label="Statut">
					<StatusBadge occupied={apartment.occupied} />
				</InfoRow>

				<InfoRow label="Plateforme">
					<PlatformIcon platform={apartment.platform} />
				</InfoRow>

				<InfoRow label="Étage">{(apartment as any).floor ?? "—"}</InfoRow>

				<InfoRow label="Clés">{(apartment as any).keys ?? "—"}</InfoRow>

				<InfoRow label="Lits">{(apartment as any).beds ?? "—"}</InfoRow>

				{/* DESCRIPTION */}
				<div className="py-3 space-y-2">
					<p className="text-xs uppercase text-gray-500">Description</p>
					<p className="pl-2 text-sm text-gray-300 leading-relaxed">{(apartment as any).description || "Aucune description"}</p>
				</div>

				<div className="py-3 space-y-2">
					<p className="text-xs uppercase text-gray-500">Image</p>
					{(apartment as any).image && (
						<div className="mt-3 pl-2">
							<img
								src={(apartment as any).image}
								onError={(e) => {
									e.currentTarget.src = "/images/house-placeholder.jpg";
								}}
								alt="Apartment"
								className="h-50 w-full rounded-xl object-cover border border-white/10"
							/>
						</div>
					)}
				</div>

				{/* ICAL */}
				<div className="py-3 space-y-2">
					<p className="text-xs uppercase text-gray-500">Airbnb iCal</p>
					<a href={(apartment as any).airbnbIcal} target="_blank" className="pl-2 text-sm text-blue-400 break-all hover:underline">
						{(apartment as any).airbnbIcal || "—"}
					</a>
				</div>

				{/* ID */}
				<div className="py-3 space-y-2">
					<p className="text-xs uppercase text-gray-500">ID</p>
					<p className="pl-2 text-sm text-gray-400">{apartment._id}</p>
				</div>
			</div>

			{/* DESKTOP */}
			<div className="hidden md:grid grid-cols-7 gap-10 p-6">
				{/* LEFT */}
				<div className="col-span-3 divide-y divide-white/5">
					<InfoRow label="Client">{typeof apartment.clientId === "string" ? "—" : (apartment.clientId?.name ?? "—")}</InfoRow>

					<InfoRow label="Statut">
						<StatusBadge occupied={apartment.occupied} />
					</InfoRow>

					<InfoRow label="Plateforme">
						<PlatformIcon platform={apartment.platform} />
					</InfoRow>

					<InfoRow label="Étage">{(apartment as any).floor ?? "—"}</InfoRow>

					<InfoRow label="Clés">{(apartment as any).keys ?? "—"}</InfoRow>

					<InfoRow label="Lits">{(apartment as any).beds ?? "—"}</InfoRow>
				</div>

				{/* RIGHT */}
				<div className="col-span-4 divide-y divide-white/5">
					<div className="py-3 space-y-2">
						<p className="text-xs uppercase text-gray-500">Description</p>
						<p className="pl-2 text-sm text-gray-200 leading-relaxed">{(apartment as any).description || "Aucune description"}</p>
					</div>

					<div className="py-3 space-y-2">
						<p className="text-xs uppercase text-gray-500">Image</p>
						{(apartment as any).image && (
							<div className="mt-3 pl-2">
								<img
									src={(apartment as any).image}
									onError={(e) => {
										e.currentTarget.src = "/images/house-placeholder.jpg";
									}}
									alt="Apartment"
									className="h-50 w-full rounded-xl object-cover border border-white/10"
								/>
							</div>
						)}
					</div>

					<div className="py-3 space-y-2">
						<p className="text-xs uppercase text-gray-500">Airbnb iCal</p>
						<a href={(apartment as any).airbnbIcal} target="_blank" className="pl-2 text-sm text-blue-400 break-all hover:underline">
							{(apartment as any).airbnbIcal || "—"}
						</a>
					</div>

					<div className="py-3 space-y-2">
						<p className="text-xs uppercase text-gray-500">ID</p>
						<p className="pl-2 text-sm text-gray-200">{apartment._id}</p>
					</div>
				</div>
			</div>

			{/* ── FOOTER ── */}
			<div className="mt-4 flex items-center justify-end gap-4 border-t border-white/5 px-6 py-4">
				<RemoveButton action={() => onDelete(apartment)} btnSize="sm" />
				<EditButton action={() => onEdit(apartment)} btnSize="sm" />
			</div>
		</Modal>
	);
}
