"use client";

import { useEffect, useState } from "react";
import {
	FaXmark,
	FaUser,
	FaHouse,
	FaCalendarDays,
	FaCheck,
	FaGear,
	FaGlobe,
	FaFlag,
	FaMoneyBill,
	FaBroom,
	FaHandshake,
	FaKey,
	FaClipboardCheck,
	FaDoorOpen,
	FaBed,
	FaScrewdriverWrench,
} from "react-icons/fa6";
import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";

import type { Apartment, Client, Reservation } from "@/types";
import { PLATFORMS } from "@/utils/constants";

import type { ReservationFormModalProps } from "@/types/modal";

import { INPUT_CLASS } from "@/utils";
import { PlatformIconButton } from "@/components/ui/PlatformIcon";

// ─── types ────────────────────────────────────────────────────────────────────

interface CustomTask {
	id: string;
	label: string;
	enabled: boolean;
}

interface FormState {
	guestName: string;
	guestEmail: string;
	guestPhone: string;
	apartmentId: string;
	checkIn: string;
	checkOut: string;
	arrivalTime: string;
	departureTime: string;
	nights: number;
	guests: number;
	platform: Reservation["platform"];
	totalAmount: number;
	currency: string;
	status: Reservation["status"];
	externalId: string;
	icalUid: string;
	notes: string;
}

// ─── tab config ───────────────────────────────────────────────────────────────

const TABS = [
	{ id: "guest", label: "Voyageur", icon: FaUser },
	{ id: "stay", label: "Séjour", icon: FaCalendarDays },
	{ id: "tasks", label: "Tâches", icon: FaCheck },
	{ id: "meta", label: "Détails", icon: FaGear },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── preset tasks ─────────────────────────────────────────────────────────────

const PRESET_TASKS = [
	{ id: "welcome", label: "Accueil voyageur", icon: FaHandshake, defaultOn: true },
	{ id: "keybox", label: "Boîte à clés", icon: FaKey, defaultOn: true },
	{ id: "cleaning_after", label: "Ménage après départ", icon: FaBroom, defaultOn: true },
	{ id: "restock", label: "Achat de produits ménagers", icon: FaBed, defaultOn: false },
	{ id: "maintenance", label: "Vérification technique", icon: FaScrewdriverWrench, defaultOn: false },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function calcNights(checkIn: string, checkOut: string) {
	if (!checkIn || !checkOut) return null;
	const diff = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
	return diff > 0 ? diff : null;
}

// ─── sub: tab bar ─────────────────────────────────────────────────────────────

function TabBar({ current, onChange }: { current: TabId; onChange: (t: TabId) => void }) {
	return (
		<div className="flex gap-1">
			{TABS.map((tab) => {
				const active = tab.id === current;
				const Icon = tab.icon;

				return (
					<button
						key={tab.id}
						type="button"
						onClick={() => onChange(tab.id)}
						className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all ${active ? "bg-white/10 text-white" : "text-gray-600 hover:text-gray-400"}`}
					>
						<span className={`flex h-5 w-5 items-center justify-center rounded-full transition-all ${active ? "bg-emerald-500 text-white" : "bg-white/5 text-gray-600"}`}>
							<Icon size={10} />
						</span>

						<span className="hidden sm:inline">{tab.label}</span>
					</button>
				);
			})}
		</div>
	);
}

// ─── sub: section title ───────────────────────────────────────────────────────

function SectionTitle({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub?: string }) {
	return (
		<div className="mb-5 flex items-center gap-3 border-b pb-4 border-b-emerald-600/60">
			<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
				<Icon size={16} />
			</div>

			<div>
				<p className="text-sm font-semibold text-white">{title}</p>
				{sub && <p className="text-xs text-gray-600">{sub}</p>}
			</div>
		</div>
	);
}

// ─── sub: platform selector ───────────────────────────────────────────────────

function PlatformSelector({ value, onChange }: { value: Reservation["platform"]; onChange: (v: Reservation["platform"]) => void }) {
	return (
		<div className="grid grid-cols-4 gap-2 mb-4">
			{PLATFORMS.map((opt) => {
				const active = value === opt.value;
				return <PlatformIconButton key={opt.value} platform={opt.value} action={() => onChange(opt.value)} active={active} />;
			})}
		</div>
	);
}

// ─── sub: status selector ────────────────────────────────────────────────────

function StatusSelector({ value, onChange }: { value: Reservation["status"]; onChange: (v: Reservation["status"]) => void }) {
	const options: { value: Reservation["status"]; label: string; color: string; bg: string }[] = [
		{ value: "pending", label: "En attente", color: "#D4934A", bg: "rgba(212,147,74,0.14)" },
		{ value: "confirmed", label: "Confirmée", color: "#9D91F5", bg: "rgba(157,145,245,0.14)" },
		{ value: "cancelled", label: "Annulée", color: "#E07070", bg: "rgba(224,112,112,0.14)" },
		{ value: "completed", label: "Terminée", color: "#666", bg: "rgba(255,255,255,0.1)" },
	];
	return (
		<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
			{options.map((opt) => {
				const active = value === opt.value;
				return (
					<button
						key={opt.value}
						type="button"
						onClick={() => onChange(opt.value)}
						style={active ? { background: opt.bg, color: opt.color, borderColor: `${opt.color}44` } : {}}
						className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-sm font-medium transition-all ${
							active ? "" : "border-white/[0.07] text-gray-500 hover:border-white/10 hover:text-gray-300"
						}`}
					>
						{active && <span className="h-1.5 w-1.5 rounded-full" style={{ background: opt.color }} />}
						{opt.label}
					</button>
				);
			})}
		</div>
	);
}

// ─── sub: amount input ───────────────────────────────────────────────────────

function AmountInput({ label, value, onChange, currency }: { label: string; value: number; onChange: (v: number) => void; currency: string }) {
	return (
		<div className="flex flex-col gap-1.5">
			<label className="text-[11px] uppercase tracking-wide text-gray-600">{label}</label>
			<div className="w-60 flex items-center overflow-hidden rounded-xl border border-white/10 bg-black/20 focus-within:border-blue-500">
				<input
					type="number"
					min={0}
					value={value || ""}
					onChange={(e) => onChange(Number(e.target.value))}
					placeholder="0"
					className="w-40 bg-transparent px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
				/>
				<span className="flex h-full w-full items-center justify-center border-l text-center border-white/10 px-3 py-2.5 text-xs font-medium text-white">{currency}</span>
			</div>
		</div>
	);
}

// ─── sub: task toggle ────────────────────────────────────────────────────────

function TaskToggle({ icon: Icon, label, enabled, onChange }: { icon: React.ElementType; label: string; enabled: boolean; onChange: (v: boolean) => void }) {
	return (
		<button
			type="button"
			onClick={() => onChange(!enabled)}
			className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
				enabled ? "border-violet-500/30 bg-violet-500/10 text-violet-200" : "border-white/[0.06] bg-white/[0.02] text-gray-600 hover:border-white/10 hover:text-gray-500"
			}`}
		>
			<div className="text-base">
				<Icon size={16} />
			</div>

			<span className="flex-1 text-sm font-medium">{label}</span>

			<span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] transition-all ${enabled ? "bg-violet-500 text-white" : "bg-white/5 text-gray-700"}`}>
				{enabled ? "✓" : ""}
			</span>
		</button>
	);
}

// ─── main modal ───────────────────────────────────────────────────────────────

export default function ReservationFormModal({ reservation, onClose, onSave, clients = [], apartments = [] }: ReservationFormModalProps) {
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [tab, setTab] = useState<TabId>("guest");

	// preset tasks
	const [presetTasks, setPresetTasks] = useState<Record<string, boolean>>(Object.fromEntries(PRESET_TASKS.map((t) => [t.id, t.defaultOn])));

	// custom tasks
	const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
	const [customTaskInput, setCustomTaskInput] = useState("");
	const [clientId, setClientId] = useState<string>("");
	const [form, setForm] = useState<FormState>({
		guestName: reservation?.guestName ?? "",
		guestEmail: reservation?.guestEmail ?? "",
		guestPhone: reservation?.guestPhone ?? "",
		apartmentId: typeof reservation?.apartmentId === "object" ? reservation.apartmentId._id : (reservation?.apartmentId ?? ""),
		checkIn: reservation?.checkIn ? new Date(reservation.checkIn).toISOString().split("T")[0] : "",
		checkOut: reservation?.checkOut ? new Date(reservation.checkOut).toISOString().split("T")[0] : "",
		nights: calcNights(reservation?.checkIn ?? "", reservation?.checkOut ?? "") ?? 0,
		arrivalTime: reservation?.arrivalTime ?? "",
		departureTime: reservation?.departureTime ?? "",
		guests: reservation?.guests ?? 1,
		platform: reservation?.platform ?? "airbnb",
		status: reservation?.status ?? "confirmed",
		totalAmount: reservation?.totalAmount ?? 0,
		currency: reservation?.currency ?? "EUR",
		externalId: reservation?.externalId ?? "",
		icalUid: reservation?.icalUid ?? "",
		notes: reservation?.notes ?? "",
	});

	useEffect(() => {
		if (!reservation?.apartmentId) return;

		const apartmentId = typeof reservation.apartmentId === "object" ? reservation.apartmentId._id : reservation.apartmentId;

		const apartment = apartments.find((a) => a._id === apartmentId);

		if (!apartment) return;

		const cId = typeof apartment.clientId === "object" ? apartment.clientId._id : apartment.clientId;

		setClientId(cId);
	}, [reservation, apartments]);

	useEffect(() => {
		if (!clientId) return;
		const filtered = apartments.filter((a) => {
			const cId = typeof a.clientId === "object" ? a.clientId?._id : a.clientId;
			return cId === clientId;
		});
		if (filtered.length === 0) return;
		setForm((p) => ({ ...p, apartmentId: filtered[0]._id }));
	}, [clientId, apartments]);

	function set<K extends keyof FormState>(field: K, value: FormState[K]) {
		setForm((prev) => ({ ...prev, [field]: value }));
	}

	useEffect(() => {
		const n = calcNights(form.checkIn, form.checkOut);

		if (n !== null) {
			setForm((prev) => ({
				...prev,
				nights: n,
			}));
		}
	}, [form.checkIn, form.checkOut]);

	function addCustomTask() {
		const label = customTaskInput.trim();
		if (!label) return;
		setCustomTasks((prev) => [...prev, { id: `custom_${Date.now()}`, label, enabled: true }]);
		setCustomTaskInput("");
	}

	function removeCustomTask(id: string) {
		setCustomTasks((prev) => prev.filter((t) => t.id !== id));
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setSaving(true);
		setError(null);
		try {
			// ─── VALIDATION ─────────────────────────────
			const requiredFields = [
				{ key: "guestName", label: "Nom du voyageur" },
				{ key: "apartmentId", label: "Appartement" },
				{ key: "checkIn", label: "Date d'arrivée" },
				{ key: "checkOut", label: "Date de départ" },
			] as const;

			const missingFields = requiredFields.filter((f) => !form[f.key]);

			if (missingFields.length > 0) {
				const message = "Champs requis manquants : " + missingFields.map((f) => f.label).join(", ");

				throw new Error(message);
			}

			const enabledPresets = PRESET_TASKS.filter((t) => presetTasks[t.id]).map((t) => ({ type: t.id, label: t.label }));
			const enabledCustoms = customTasks.filter((t) => t.enabled).map((t) => ({ type: "custom", label: t.label }));
			await onSave({
				...form,
				apartmentId: form.apartmentId || null,
				nights: form.nights,
			});
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Une erreur est survenue");
		} finally {
			setSaving(false);
		}
	}

	const filteredApartments = apartments.filter((a) => {
		const cId = typeof a.clientId === "object" ? a.clientId?._id : a.clientId;
		return cId === clientId;
	});

	const nights = calcNights(form.checkIn, form.checkOut);
	const isEditing = !!reservation;
	const taskCount = Object.values(presetTasks).filter(Boolean).length + customTasks.filter((t) => t.enabled).length;

	return (
		<Modal open={true} onClose={onClose} closeOnBackdrop={false}>
			<div className="w-full min-w-3xl min-h-[90vh] overflow-hidden rounded-2xl bg-[#0D0F18] shadow-2xl">
				{/* accent */}
				<div className="h-0.5 bg-gradient-to-r from-violet-500 via-violet-400 to-transparent" />

				{/* header */}
				<div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
					<div>
						<h2 className="text-base font-semibold text-white">{isEditing ? "Modifier la réservation" : "Nouvelle réservation"}</h2>
						<p className="mt-0.5 text-xs text-gray-600">{isEditing ? `Ref. ${reservation?.externalId || reservation?._id?.slice(-6)}` : "Remplissez les informations du séjour"}</p>
					</div>
					<button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-500 transition hover:bg-white/5 hover:text-gray-300">
						<FaXmark size={14} />
					</button>
				</div>

				{/* tab bar */}
				<div className="border-b border-white/[0.06] px-6 py-3">
					<TabBar current={tab} onChange={setTab} />
				</div>

				{/* error */}
				{error && (
					<div className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
						<span>⚠</span> {error}
					</div>
				)}

				{/* form */}
				<form onSubmit={handleSubmit}>
					<div className="h-[70vh] overflow-y-auto px-6 py-5">
						{/* ── TAB: Voyageur ── */}
						{tab === "guest" && (
							<div className="space-y-5">
								<SectionTitle icon={FaUser} title="Informations voyageur" sub="Nom, email et téléphone du séjournant" />

								<Field label="Nom complet *">
									<input required type="text" value={form.guestName} onChange={(e) => set("guestName", e.target.value)} placeholder="Sophie Martin" className={INPUT_CLASS} />
								</Field>

								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<Field label="Email">
										<input type="email" value={form.guestEmail} onChange={(e) => set("guestEmail", e.target.value)} placeholder="sophie@email.com" className={INPUT_CLASS} />
									</Field>
									<Field label="Téléphone">
										<input type="tel" value={form.guestPhone} onChange={(e) => set("guestPhone", e.target.value)} placeholder="+33 6 01 02 03 04" className={INPUT_CLASS} />
									</Field>
								</div>

								<div className="mt-10">
									<SectionTitle icon={FaHouse} title="Logement" sub="Propriétaire et appartement concerné" />
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<Field label="Client / Propriétaire">
											<select
												value={clientId}
												onChange={(e) => {
													setClientId(e.target.value);
													set("apartmentId", "");
												}}
												className={INPUT_CLASS}
											>
												<option value="">Sélectionner…</option>
												{clients.map((c: Client) => (
													<option key={c._id} value={c._id}>
														{c.name}
													</option>
												))}
											</select>
										</Field>
										<Field label="Appartement *">
											<select required value={form.apartmentId} onChange={(e) => set("apartmentId", e.target.value)} className={INPUT_CLASS} disabled={!clientId}>
												<option value="">Sélectionner…</option>
												{filteredApartments.map((a: Apartment) => (
													<option key={a._id} value={a._id}>
														{a.name}
													</option>
												))}
											</select>
										</Field>
									</div>
								</div>
							</div>
						)}

						{/* ── TAB: Séjour ── */}
						{tab === "stay" && (
							<div className="space-y-5">
								<SectionTitle icon={FaCalendarDays} title="Dates du séjour" sub="Arrivée, départ et nombre de voyageurs" />

								<div className="grid grid-cols-3 gap-3 items-center justify-center">
									<div className="w-50">
										<label className="mb-1.5 block text-[11px] uppercase tracking-wide text-gray-600">Arrivée *</label>
										<input required type="date" value={form.checkIn} onChange={(e) => set("checkIn", e.target.value)} className={INPUT_CLASS} />
									</div>
									<div className="w-50">
										<label className="mb-1.5 block text-[11px] uppercase tracking-wide text-gray-600">Départ *</label>
										<input required type="date" value={form.checkOut} onChange={(e) => set("checkOut", e.target.value)} className={INPUT_CLASS} />
									</div>

									{nights !== null && (
										<div className="flex items-center justify-center">
											<div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
												<span>🌙</span> {nights} nuit{nights > 1 ? "s" : ""}
											</div>
										</div>
									)}
								</div>

								<div className="grid grid-cols-3 gap-3">
									<div className="w-50">
										<label className="mb-1.5 block text-[11px] uppercase tracking-wide text-gray-600">Heure d'arrivée</label>
										<input type="time" value={form.arrivalTime} onChange={(e) => set("arrivalTime", e.target.value)} className={INPUT_CLASS} />
									</div>
									<div className="w-50">
										<label className="mb-1.5 block text-[11px] uppercase tracking-wide text-gray-600">Heure de départ</label>
										<input type="time" value={form.departureTime} onChange={(e) => set("departureTime", e.target.value)} className={INPUT_CLASS} />
									</div>

									<div>
										<label className="mb-1.5 block text-[11px] uppercase tracking-wide text-gray-600">Nombre de voyageurs</label>
										<div className="flex items-center gap-3">
											<button
												type="button"
												onClick={() => set("guests", Math.max(1, form.guests - 1))}
												className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-gray-400 transition hover:bg-white/5"
											>
												−
											</button>
											<span className="min-w-[2rem] text-center text-lg font-semibold text-white">{form.guests}</span>
											<button
												type="button"
												onClick={() => set("guests", form.guests + 1)}
												className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-gray-400 transition hover:bg-white/5"
											>
												+
											</button>
											<span className="text-sm text-gray-600">voyageur{form.guests > 1 ? "s" : ""}</span>
										</div>
									</div>
								</div>

								<div className="mt-10">
									<SectionTitle icon={FaGlobe} title="Plateforme et statut de la réservation" sub="Source et état de la réservation" />
									<PlatformSelector value={form.platform} onChange={(v) => set("platform", v)} />
									<StatusSelector value={form.status} onChange={(v) => set("status", v)} />
								</div>

								<div className="mt-10">
									<SectionTitle icon={FaMoneyBill} title="Montant total" sub="Montant global de la réservation" />
									<div className="w-70">
										<AmountInput label="Montant" value={form.totalAmount} onChange={(v) => set("totalAmount", v)} currency={form.currency} />
										<div className="mt-3">
											<div className="grid grid-cols-4 gap-2">
												{["EUR", "USD", "GBP", "CHF"].map((c) => (
													<button
														key={c}
														type="button"
														onClick={() => set("currency", c)}
														className={`rounded-xl border py-2 text-xs font-medium transition ${
															form.currency === c ? "border-violet-500/40 bg-violet-500/15 text-violet-300" : "border-white/[0.07] text-gray-400 hover:border-white/10 hover:text-gray-400"
														}`}
													>
														{c}
													</button>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* ── TAB: Tâches ── */}
						{tab === "tasks" && (
							<div className="space-y-8">
								<SectionTitle icon={FaClipboardCheck} title="Tâches associées" sub={`${taskCount} tâche${taskCount !== 1 ? "s" : ""} sélectionnée${taskCount !== 1 ? "s" : ""}`} />

								{/* presets */}
								<div>
									<p className="mb-3 text-[11px] uppercase tracking-wide text-gray-600">Tâches standard</p>
									<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
										{PRESET_TASKS.map((t) => (
											<TaskToggle
												key={t.id}
												icon={t.icon}
												label={t.label}
												enabled={presetTasks[t.id]}
												onChange={(v) =>
													setPresetTasks((prev) => ({
														...prev,
														[t.id]: v,
													}))
												}
											/>
										))}
									</div>
								</div>

								{/* custom tasks */}
								<div className="border-t border-white/[0.05] pt-8">
									<p className="mb-3 text-[11px] uppercase tracking-wide text-gray-600">Tâches spécifiques</p>

									{customTasks.length > 0 && (
										<div className="mb-3 flex flex-col gap-2">
											{customTasks.map((t) => (
												<div key={t.id} className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/08 px-4 py-2.5">
													<span className="text-sm text-violet-300">📝</span>
													<span className="flex-1 text-sm font-medium text-violet-200">{t.label}</span>
													<button type="button" onClick={() => removeCustomTask(t.id)} className="text-gray-700 transition hover:text-red-400">
														<FaXmark size={12} />
													</button>
												</div>
											))}
										</div>
									)}

									<div className="flex gap-2">
										<input
											type="text"
											value={customTaskInput}
											onChange={(e) => setCustomTaskInput(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													addCustomTask();
												}
											}}
											placeholder="Ex : Préparer le guide d'accueil…"
											className={`${INPUT_CLASS} flex-1`}
										/>
										<button
											type="button"
											onClick={addCustomTask}
											disabled={!customTaskInput.trim()}
											className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20 disabled:opacity-30"
										>
											+ Ajouter
										</button>
									</div>
									<p className="mt-2 text-xs text-gray-700">Appuyez sur Entrée pour ajouter rapidement</p>
								</div>
							</div>
						)}

						{/* ── TAB: Détails ── */}
						{tab === "meta" && (
							<div className="space-y-5">
								<SectionTitle icon={FaGear} title="Synchronisation & notes" sub="Identifiants externes et informations complémentaires" />

								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<Field label="Référence externe">
										<input type="text" value={form.externalId} onChange={(e) => set("externalId", e.target.value)} placeholder="AIRBNB-12345" className={INPUT_CLASS} />
									</Field>
									<Field label="iCal UID">
										<input type="text" value={form.icalUid} onChange={(e) => set("icalUid", e.target.value)} placeholder="uid@airbnb.com" className={INPUT_CLASS} />
									</Field>
								</div>

								<Field label="Notes">
									<textarea
										rows={5}
										value={form.notes}
										onChange={(e) => set("notes", e.target.value)}
										placeholder="Code d'accès, instructions d'arrivée, animaux, préférences particulières…"
										className={`${INPUT_CLASS} resize-none leading-relaxed`}
									/>
								</Field>
							</div>
						)}
					</div>

					{/* footer */}
					<div className="flex items-center gap-3 border-t border-white/[0.06] px-6 py-5">
						<button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 px-6 py-2.5 text-sm text-gray-300 transition hover:bg-white/10">
							Annuler
						</button>
						<button type="submit" disabled={saving} className="flex-1 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50">
							{saving ? "Enregistrement…" : isEditing ? "Enregistrer" : "Créer la réservation"}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
