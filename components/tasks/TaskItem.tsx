"use client";

import { FaRegClock, FaLocationDot } from "react-icons/fa6";
import { LuCircleCheck, LuCircleX, LuTimer, LuClock3, LuUserRound } from "react-icons/lu";
import { LiaBroomSolid, LiaToolsSolid, LiaSignInAltSolid, LiaSignOutAltSolid, LiaClipboardCheckSolid, LiaExpandSolid } from "react-icons/lia";

import type { Task } from "@/types";
import { formatDate, formatMinutes } from "@/utils";

const taskTypeConfig = {
	cleaning: {
		icon: LiaBroomSolid,
		bg: "bg-blue-100",
		color: "text-blue-600",
		label: "Nettoyage",
	},
	checkin: {
		icon: LiaSignInAltSolid,
		bg: "bg-green-100",
		color: "text-green-600",
		label: "Accueil voyageurs",
	},
	checkout: {
		icon: LiaSignOutAltSolid,
		bg: "bg-orange-100",
		color: "text-orange-600",
		label: "Départ voyageurs",
	},
	maintenance: {
		icon: LiaToolsSolid,
		bg: "bg-red-100",
		color: "text-red-600",
		label: "Maintenance",
	},
	inspection: {
		icon: LiaClipboardCheckSolid,
		bg: "bg-purple-100",
		color: "text-purple-600",
		label: "Inspection",
	},
	chloe: {
		icon: LuUserRound,
		bg: "bg-amber-100",
		color: "text-amber-600",
		label: "Chloé",
	},

	amy: {
		icon: LuUserRound,
		bg: "bg-purple-100",
		color: "text-purple-600",
		label: "Amy",
	},
	adrian: {
		icon: LuUserRound,
		bg: "bg-purple-100",
		color: "text-purple-600",
		label: "Adrian",
	},
	other: {
		icon: LiaExpandSolid,
		bg: "bg-gray-200",
		color: "text-gray-600",
		label: "Autre",
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

const statusConfig = {
	pending: {
		icon: LuTimer,
		color: "text-amber-400",
		label: "Tâche à faire",
	},
	"in progress": {
		icon: LuClock3,
		color: "text-teal-500",
		label: "Tâche en cours",
	},
	done: {
		icon: LuCircleCheck,
		color: "text-green-500",
		label: "Tâche terminée",
	},
	cancelled: {
		icon: LuCircleX,
		color: "text-red-600",
		label: "Tâche annulée",
	},
} as const;

const PRIORITY_LABELS = {
	low: "Basse",
	medium: "Moyenne",
	high: "Haute",
} as const;
interface Props {
	task: Task;
	onClick?: () => void;
}

export default function TaskItem({ task, onClick }: Props) {
	const config = taskTypeConfig[task.type] ?? taskTypeConfig.other;
	const priority = priorityConfig[task.priority] ?? priorityConfig.medium;

	const status = statusConfig[task.status as keyof typeof statusConfig];
	const StatusIcon = status?.icon;

	const priorityLabel = PRIORITY_LABELS[task.priority as keyof typeof PRIORITY_LABELS] ?? task.priority;

	const TypeIcon = config.icon;

	const apartment = typeof task.apartmentId === "object" ? task.apartmentId : null;

	return (
		<div onClick={onClick} className="py-2 sm:p-4 flex items-center justify-between hover:bg-muted/30 transition cursor-pointer">
			<div className="flex items-center gap-4">
				{StatusIcon && (
					<div className={`flex items-center justify-center`}>
						<StatusIcon className={`text-2xl ${status.color}`} title={status.label} />
					</div>
				)}
				<div className={`min-w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center ${config.bg}`}>
					<TypeIcon className={`sm:text-3xl ${config.color}`} title={config.label} />
				</div>
				<div>
					<h3 className="font-medium text-white">{task.title}</h3>

					<div className="sm:flex items-center gap-4 mt-1 text-sm text-muted-foreground">
						{task.duration != null && task.duration != 0 && (
							<div className="flex items-center gap-1 text-gray-400">
								<FaRegClock className="text-sm" />
								<span>{formatMinutes(task.duration)}</span>
							</div>
						)}

						{apartment && (
							<div className="flex items-center gap-1 text-violet-300">
								<FaLocationDot className="text-sm" />
								<span>{apartment.name}</span>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="text-right">
				{task.priority && task.priority != "N/A" && <div className={`text-xs px-2 py-1 rounded-full inline-block capitalize ${priority.bg} ${priority.text}`}>{priorityLabel}</div>}

				<p className="text-sm font-medium mt-2 text-red-200">{formatDate(task.dueDate)}</p>
			</div>
		</div>
	);
}
