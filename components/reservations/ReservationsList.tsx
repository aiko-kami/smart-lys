"use client";

import { useMemo, useState } from "react";
import type { Reservation } from "@/types";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";
import { ViewButton, EditButton } from "@/components/buttons/Buttons";

interface Props {
	reservations: Reservation[];
	onReservationClick: (reservation: Reservation) => void;
	onShowReservationDetails: (reservation: Reservation) => void;
	onModifyReservation: (reservation: Reservation) => void;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDate(d?: string | Date) {
	if (!d) return "—";
	return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

const STATUS_META: Record<string, { label: string; color: string; bg: string; dot: string }> = {
	pending: { label: "En attente", color: "#D4934A", bg: "rgba(212,147,74,0.14)", dot: "#D4934A" },
	confirmed: { label: "Confirmée", color: "#9D91F5", bg: "rgba(157,145,245,0.14)", dot: "#7C6EE8" },
	cancelled: { label: "Annulée", color: "#E07070", bg: "rgba(224,112,112,0.14)", dot: "#C04040" },
	completed: { label: "Terminée", color: "#666", bg: "rgba(255,255,255,0.05)", dot: "#444" },
};

type SortKey = "guestName" | "checkIn" | "checkOut" | "nights" | "totalAmount" | "status" | "platform";
type SortDir = "asc" | "desc";

function sortReservations(list: Reservation[], key: SortKey, dir: SortDir) {
	return [...list].sort((a, b) => {
		let av: any = a[key];
		let bv: any = b[key];
		if (key === "checkIn" || key === "checkOut") {
			av = new Date(av).getTime();
			bv = new Date(bv).getTime();
		}
		if (av == null) return 1;
		if (bv == null) return -1;
		if (av < bv) return dir === "asc" ? -1 : 1;
		if (av > bv) return dir === "asc" ? 1 : -1;
		return 0;
	});
}

// ─── sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status?: string }) {
	const m = STATUS_META[status ?? "pending"] ?? STATUS_META.pending;
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: m.bg, color: m.color }}>
			<span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: m.dot }} />
			{m.label}
		</span>
	);
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
	return <span className={`text-[14px] font-bold transition ${active ? "text-emerald-500" : ""}`}>{active && dir === "desc" ? <FaLongArrowAltDown /> : <FaLongArrowAltUp />}</span>;
}

function Th({ label, sortKey, current, dir, onSort }: { label: string; sortKey: SortKey; current: SortKey; dir: SortDir; onSort: (k: SortKey) => void }) {
	const active = current === sortKey;

	return (
		<th
			onClick={() => onSort(sortKey)}
			className="cursor-pointer select-none whitespace-nowrap px-2 py-3 text-[10px] font-medium uppercase tracking-widest text-gray-500 hover:text-gray-400 transition"
		>
			<div className="flex items-center justify-center">
				{label}
				<SortIcon active={active} dir={dir} />
			</div>
		</th>
	);
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function ReservationsList({ reservations, onReservationClick, onShowReservationDetails, onModifyReservation }: Props) {
	const [search, setSearch] = useState("");
	const [sortKey, setSortKey] = useState<SortKey>("checkIn");
	const [sortDir, setSortDir] = useState<SortDir>("asc");

	function handleSort(key: SortKey) {
		if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
		else {
			setSortKey(key);
			setSortDir("asc");
		}
	}

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		const list = reservations.filter((r) => r.guestName?.toLowerCase().includes(q) || r.guestEmail?.toLowerCase().includes(q) || r.platform?.toLowerCase().includes(q));
		return sortReservations(list, sortKey, sortDir);
	}, [reservations, search, sortKey, sortDir]);

	return (
		<div>
			<div className="flex flex-col rounded-2xl border border-white/10 bg-[#111827] overflow-hidden mb-3">
				{/* header */}
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
					<div>
						<h2 className="text-base font-semibold text-white">Réservations</h2>
						<p className="mt-0.5 text-xs text-gray-600">
							{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
							{search && ` pour "${search}"`}
						</p>
					</div>
					<div className="relative">
						<svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<circle cx="11" cy="11" r="8" />
							<path d="m21 21-4.35-4.35" />
						</svg>
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Rechercher une réservation..."
							className="w-64 rounded-xl border border-white/10 bg-black/20 py-2 pl-9 pr-4 text-sm text-white placeholder-gray-600 focus:border-violet-500/40 focus:outline-none"
						/>
					</div>
				</div>

				{/* table */}
				<div className="overflow-x-auto">
					<table className="w-full min-w-[700px] border-collapse">
						<thead>
							<tr className="border-b border-white/10 bg-black/10">
								<Th label="Voyageur" sortKey="guestName" current={sortKey} dir={sortDir} onSort={handleSort} />
								<Th label="Arrivée" sortKey="checkIn" current={sortKey} dir={sortDir} onSort={handleSort} />
								<Th label="Départ" sortKey="checkOut" current={sortKey} dir={sortDir} onSort={handleSort} />
								<Th label="Nuits" sortKey="nights" current={sortKey} dir={sortDir} onSort={handleSort} />
								<Th label="Plateforme" sortKey="platform" current={sortKey} dir={sortDir} onSort={handleSort} />
								<Th label="Statut" sortKey="status" current={sortKey} dir={sortDir} onSort={handleSort} />
								<Th label="Montant" sortKey="totalAmount" current={sortKey} dir={sortDir} onSort={handleSort} />
								{/* actions — pas de sort */}
								<th className="whitespace-nowrap px-2 py-3 text-[10px] font-medium uppercase tracking-widest text-gray-500 cursor-default">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filtered.length === 0 && (
								<tr>
									<td colSpan={8} className="py-16 text-center text-sm italic text-gray-600">
										Aucune réservation trouvée
									</td>
								</tr>
							)}
							{filtered.map((r) => (
								<tr
									key={r._id}
									onClick={() => onReservationClick(r)}
									onDoubleClick={() => onShowReservationDetails(r)}
									className="group cursor-pointer border-b border-white/[0.04] transition hover:bg-white/[0.03] last:border-0"
								>
									{/* voyageur */}
									<td className="px-3 py-3">
										<div className="flex items-center gap-2.5">
											<div>
												<p className="text-sm font-medium text-white leading-tight">{r.guestName ?? "—"}</p>
												{r.guestEmail && <p className="text-xs text-gray-600 mt-0.5">{r.guestEmail}</p>}
											</div>
											{r.isIncomplete && (
												<span className="text-amber-400 text-xs" title="Informations manquantes">
													⚠
												</span>
											)}
										</div>
									</td>
									{/* arrivée */}
									<td className="px-2 py-3">
										<p className="text-sm text-gray-300">{formatDate(r.checkIn)}</p>
										{r.arrivalTime && <p className="text-xs text-gray-600 mt-0.5">{r.arrivalTime}</p>}
									</td>
									{/* départ */}
									<td className="px-2 py-3">
										<p className="text-sm text-gray-300">{formatDate(r.checkOut)}</p>
										{r.departureTime && <p className="text-xs text-gray-600 mt-0.5">{r.departureTime}</p>}
									</td>
									{/* nuits */}
									<td className="px-2 py-3 text-center text-gray-300">{r.nights ?? "—"}</td>
									{/* plateforme */}
									<td className="px-2 py-3 text-center">
										<PlatformIcon platform={r.platform} logoOnly />
									</td>
									{/* statut */}
									<td className="px-2 py-3 text-center">
										<StatusBadge status={r.status} />
									</td>
									{/* montant */}
									<td className="px-4 py-3 text-right">
										{r.totalAmount ? (
											<span className="text-white">
												<span className="text-sm font-semibold">{r.totalAmount}</span>
												<span className="text-[10px]"> {r.currency ?? "€"}</span>
											</span>
										) : (
											<span className="text-sm text-gray-600">—</span>
										)}
									</td>
									{/* actions */}
									<td className="px-2 text-right align-middle">
										<div className="flex items-center justify-end gap-2">
											<ViewButton btnSize="xs" iconOnly action={() => onShowReservationDetails(r)} />
											<EditButton btnSize="xs" iconOnly action={() => onModifyReservation(r)} />
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<p className="text-xs text-gray-500">
				{filtered.length} réservation{filtered.length > 1 ? "s" : ""}
				{filtered.length !== reservations.length && ` sur ${reservations.length}`}
			</p>
		</div>
	);
}
