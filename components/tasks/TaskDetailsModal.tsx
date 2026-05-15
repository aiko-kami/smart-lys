"use client";

import { useEffect } from "react";
import { FaXmark, FaRegClock } from "react-icons/fa6";
import { LuBuilding, LuCalendarClock, LuFlame, LuPlay, LuUser } from "react-icons/lu";

import Modal from "@/components/ui/Modal";
import { RemoveButton, EditButton } from "@/components/buttons/Buttons";
import { formatDate, formatMinutes } from "@/utils";

import { taskTypeConfig, priorityConfig, statusConfig } from "@/utils/taskConfig";
import type { TaskDetailsModalProps } from "@/types/modal";

// ───────────────────────── helpers ─────────────────────────

function isOverdue(date?: string) {
	if (!date) return false;
	return new Date(date) < new Date();
}

// ───────────────────────── component ─────────────────────────

export default function TaskDetailsModal({ task, onClose, onEdit, onDelete }: TaskDetailsModalProps) {
	if (!task) return null;

	const typeKey = task.type as keyof typeof taskTypeConfig;
	const type = taskTypeConfig[typeKey] ?? taskTypeConfig.other;
	const TypeIcon = type.icon;

	const statusKey = (task.status ?? "pending") as keyof typeof statusConfig;
	const status = statusConfig[statusKey] ?? statusConfig.pending;
	const StatusIcon = status.icon;

	const priorityKey = (task.priority ?? "low") as keyof typeof priorityConfig;
	const priority = priorityConfig[priorityKey] ?? priorityConfig.low;

	const apartmentName = typeof task.apartmentId === "object" ? task.apartmentId?.name : null;

	const clientName = typeof task.clientId === "object" ? task.clientId?.name : null;

	const dueDateDanger = isOverdue(task.dueDate);

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [onClose]);

	return (
		<Modal open={!!task} onClose={onClose}>
			<div className="w-full sm:min-w-[600px] sm:max-w-2xl overflow-hidden rounded-2xl">
				{/* TOP BAR */}
				<div className={`h-1 w-full bg-gradient-to-r ${type.line}`} />

				{/* HEADER */}
				<div className="flex justify-between px-6 pt-5 pb-4">
					<div className="flex gap-3">
						<div className={`flex h-10 w-10 items-center justify-center rounded-xl ${type.bg}`}>
							<TypeIcon className={`text-xl ${type.color}`} />
						</div>

						<div>
							<h2 className="text-2xl font-semibold">{task.title}</h2>
							<p className="text-xs text-gray-400">{type.label}</p>
						</div>
					</div>

					<button onClick={onClose} className="text-gray-400 hover:text-white">
						<FaXmark />
					</button>
				</div>

				{/* BODY */}
				<div className="px-6 space-y-4">
					{/* BADGES */}
					<div className="flex justify-end gap-2">
						<div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${status.bg} ${status.color}`}>
							<StatusIcon size={12} />
							{status.labelShort}
						</div>

						<div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${priority.bg} ${priority.text}`}>
							<LuFlame size={12} />
							{priority.label}
						</div>

						{task.duration ? (
							<div className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
								<FaRegClock />
								{formatMinutes(task.duration)}
							</div>
						) : null}
					</div>

					{/* CONTENT */}
					<div className="space-y-3">
						<div className="rounded-xl border border-white/5 bg-white/5 p-3">
							<p className="text-xs text-gray-400 mb-1">Description</p>
							<p className="text-sm text-gray-200">{task.description || "Aucune description"}</p>
						</div>

						<div className="rounded-xl border border-white/5 bg-white/5 p-3">
							<p className="text-xs text-gray-400 mb-1">Notes</p>
							<p className="text-sm text-gray-200">{task.notes || "Aucune note"}</p>
						</div>
					</div>

					{/* META */}
					<div className="space-y-1 text-sm">
						<div className="flex justify-between border-b border-white/5 py-2">
							<span className="text-gray-500 flex items-center gap-1">
								<LuBuilding size={13} /> Appartement
							</span>
							<span>{apartmentName ?? "—"}</span>
						</div>

						<div className="flex justify-between border-b border-white/5 py-2">
							<span className="text-gray-500 flex items-center gap-1">
								<LuUser size={13} /> Client
							</span>
							<span>{clientName ?? "—"}</span>
						</div>

						<div className="flex justify-between border-b border-white/5 py-2">
							<span className="text-gray-500 flex items-center gap-1">
								<LuCalendarClock size={13} /> Échéance
							</span>
							<span className={dueDateDanger ? "text-red-400" : ""}>{formatDate(task.dueDate)}</span>
						</div>

						<div className="flex justify-between py-2">
							<span className="text-gray-500 flex items-center gap-1">
								<LuPlay size={13} /> Début
							</span>
							<span>{formatDate(task.startDate)}</span>
						</div>
					</div>
				</div>

				{/* FOOTER */}
				<div className="flex justify-end gap-3 border-t border-white/5 px-6 py-4">
					<RemoveButton action={() => onDelete(task)} />
					<EditButton action={() => onEdit(task)} />
				</div>
			</div>
		</Modal>
	);
}
