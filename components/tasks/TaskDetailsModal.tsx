"use client";

import { useEffect } from "react";
import { FaXmark, FaRegClock } from "react-icons/fa6";
import { LuBuilding, LuCalendarClock, LuFlame, LuCircleX, LuCircleCheck, LuPlay, LuTimer, LuUser, LuClock3, LuUserRound } from "react-icons/lu";
import { RemoveButton, EditButton } from "@/components/buttons/Buttons";
import { formatDate, formatMinutes } from "@/utils";

import { LiaBroomSolid, LiaToolsSolid, LiaSignInAltSolid, LiaSignOutAltSolid, LiaClipboardCheckSolid, LiaExpandSolid } from "react-icons/lia";

import Modal from "@/components/ui/Modal";
import { TaskDetailsModalProps } from "@/types/modal";

// ─── helpers ────────────────────────────────────────────────────────────────

function isOverdue(date?: string) {
	if (!date) return false;
	return new Date(date) < new Date();
}

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
	"in progress": { bg: "bg-teal-50", text: "text-teal-700", icon: <LuClock3 size={12} /> },
	pending: { bg: "bg-violet-50", text: "text-violet-700", icon: <LuTimer size={12} /> },
	done: { bg: "bg-green-50", text: "text-green-700", icon: <LuCircleCheck size={12} /> },
	cancelled: { bg: "bg-red-50", text: "text-red-700", icon: <LuCircleX size={12} /> },
};

const PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
	haute: { bg: "bg-amber-50", text: "text-amber-700" },
	moyenne: { bg: "bg-blue-50", text: "text-blue-700" },
	basse: { bg: "bg-gray-100", text: "text-gray-600" },
};

const taskTypeConfig = {
	cleaning: {
		icon: LiaBroomSolid,
		bg: "bg-blue-100",
		color: "text-blue-600",
		"bg-line": "bg-blue-600",
	},
	checkin: {
		icon: LiaSignInAltSolid,
		bg: "bg-green-100",
		color: "text-green-600",
		"bg-line": "bg-gradient-to-r from-green-500 to-teal-500",
	},
	checkout: {
		icon: LiaSignOutAltSolid,
		bg: "bg-orange-100",
		color: "text-orange-600",
		"bg-line": "bg-gradient-to-r from-orange-500 to-amber-400",
	},
	maintenance: {
		icon: LiaToolsSolid,
		bg: "bg-red-100",
		color: "text-red-600",
		"bg-line": "bg-gradient-to-r from-red-500 to-pink-500",
	},
	inspection: {
		icon: LiaClipboardCheckSolid,
		bg: "bg-purple-100",
		color: "text-purple-600",
		"bg-line": "bg-gradient-to-r from-purple-500 to-indigo-500",
	},
	chloe: {
		icon: LuUserRound,
		bg: "bg-amber-100",
		color: "text-amber-600",
		"bg-line": "bg-gradient-to-r from-amber-500 to-yellow-200",
	},
	amy: {
		icon: LuUserRound,
		bg: "bg-amber-100",
		color: "text-amber-600",
		"bg-line": "bg-gradient-to-r from-amber-500 to-yellow-200",
	},
	adrian: {
		icon: LuUserRound,
		bg: "bg-amber-100",
		color: "text-amber-600",
		"bg-line": "bg-gradient-to-r from-amber-500 to-yellow-200",
	},
	other: {
		icon: LiaExpandSolid,
		bg: "bg-gray-200",
		color: "text-gray-600",
		"bg-line": "bg-gradient-to-r from-gray-500 to-gray-600",
	},
} as const;

const priorityConfig = {
	low: {
		bg: "bg-green-100",
		text: "text-green-600",
	},
	medium: {
		bg: "bg-orange-100",
		text: "text-orange-600",
	},
	high: {
		bg: "bg-red-100",
		text: "text-red-600",
	},
	"N/A": {
		bg: "",
		text: "",
	},
} as const;

const STATUS_LABELS: Record<string, string> = {
	pending: "À faire",
	"in progress": "En cours",
	done: "Terminée",
	cancelled: "Annulée",
};

const PRIORITY_LABELS: Record<string, string> = {
	low: "Basse",
	medium: "Moyenne",
	high: "Haute",
};

// ─── sub-components ──────────────────────────────────────────────────────────

function MetaRow({ icon, label, children, danger }: { icon: React.ReactNode; label: string; children: React.ReactNode; danger?: boolean }) {
	return (
		<div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
			<div className="flex items-center gap-1.5 text-xs text-gray-500">
				{icon}
				{label}
			</div>
			<div className={`text-sm ${danger ? "text-red-400" : "text-gray-200"}`}>{children}</div>
		</div>
	);
}

function ContentBlock({ label, value }: { label: string; value?: string }) {
	return (
		<div className="flex-1 rounded-xl border border-white/5 bg-white/[0.03] p-3">
			<p className="mb-1.5 text-[10px] uppercase tracking-widest text-gray-500">{label}</p>
			<p className={`text-sm leading-relaxed ${value ? "text-gray-200" : "italic text-gray-600"}`}>{value || `Aucune ${label.toLowerCase()}`}</p>
		</div>
	);
}

// ─── main component ──────────────────────────────────────────────────────────

export default function TaskDetailsModal({ task, onClose, onEdit, onDelete }: TaskDetailsModalProps) {
	if (!task) return null;

	const config = taskTypeConfig[task.type] ?? taskTypeConfig.other;
	const priority = priorityConfig[task?.priority] ?? priorityConfig.medium;
	const Icon = config.icon;

	const statusKey = task.status?.toLowerCase() ?? "";
	const priorityKey = task.priority?.toLowerCase() ?? "";

	const statusLabel = STATUS_LABELS[statusKey] ?? task.status;
	const priorityLabel = PRIORITY_LABELS[priorityKey] ?? task.priority;

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [onClose]);

	if (!task) return null;

	const statusStyle = STATUS_STYLES[statusKey] ?? { bg: "bg-gray-800", text: "text-gray-400", icon: null };
	const priorityStyle = PRIORITY_STYLES[priorityKey] ?? { bg: "bg-gray-800", text: "text-gray-400" };
	const apartmentName = typeof task.apartmentId === "string" ? null : task.apartmentId?.name;
	const clientName = typeof task.clientId === "string" ? null : task.clientId?.name;
	const dueDateDanger = isOverdue(task.dueDate);

	return (
		<Modal open={!!task} onClose={onClose}>
			<div className="w-full min-w-[300px] sm:min-w-[600px] sm:max-w-2xl overflow-hidden rounded-2xl">
				{/* accent bar */}
				<div className={`h-0.5 w-full ${config["bg-line"]}`} />

				{/* ── HEADER ── */}
				<div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4">
					<div className="flex items-center gap-2">
						{/* icon chip */}
						<div className="flex flex-col items-center gap-1">
							<div className={`mt-0.5 flex h-8 w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
								{Icon && <Icon className={`text-lg sm:text-3xl ${config.color}`} />}
							</div>
							<div className="mt-1 flex flex-wrap items-center gap-2">
								{task.type && <span className="hidden sm:inline rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-gray-400 capitalize">{task.type}</span>}
							</div>
						</div>

						<div>
							<h2 className="text-2xl sm:text-3xl font-semibold leading-snug text-white mb-0.5">{task.title}</h2>
						</div>
					</div>

					<button
						onClick={onClose}
						className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-gray-500 transition hover:bg-white/5 hover:text-gray-300"
					>
						<FaXmark size={14} />
					</button>
				</div>

				{/* ── BODY ── */}
				<div className="grid grid-cols-1 gap-4 px-6">
					<div className="flex items-center justify-end gap-2 pr-1">
						{task.status && task.status != "N/A" && (
							<span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyle.bg} ${statusStyle.text}`}>
								{statusStyle.icon}
								{statusLabel}
							</span>
						)}
						{task.priority && task.priority != "N/A" && (
							<span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${priority.bg} ${priority.text}`}>
								<LuFlame size={11} />
								{priorityLabel}
							</span>
						)}
						{task.duration != null && task.duration != 0 && (
							<div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-gray-400 bg-gray-400/20">
								<FaRegClock className="text-sm" />
								<span className="text-sm font-medium text-gray-200">{formatMinutes(task.duration)}</span>
							</div>
						)}
					</div>

					<div className="flex flex-col gap-3">
						<ContentBlock label="Description" value={task.description} />
						<ContentBlock label="Notes" value={task.notes} />
					</div>
					<div>
						<MetaRow icon={<LuBuilding size={13} />} label="Appartement">
							{apartmentName ?? "—"}
						</MetaRow>
						<MetaRow icon={<LuUser size={13} />} label="Client">
							{clientName ?? "—"}
						</MetaRow>
						<MetaRow icon={<LuCalendarClock size={13} />} label="Échéance" danger={dueDateDanger}>
							{formatDate(task.dueDate)}
						</MetaRow>
						<MetaRow icon={<LuPlay size={13} />} label="Début">
							{formatDate(task.startDate)}
						</MetaRow>
					</div>
				</div>

				{/* ── FOOTER ── */}
				<div className="mt-4 flex items-center justify-end gap-4 border-t border-white/5 px-6 py-4">
					<RemoveButton action={() => onDelete(task)} btnSize="sm" />
					<EditButton action={() => onEdit(task)} btnSize="sm" />
				</div>
			</div>
		</Modal>
	);
}
