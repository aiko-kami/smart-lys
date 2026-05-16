"use client";

import { FaRegClock, FaLocationDot } from "react-icons/fa6";

import type { Task } from "@/types";
import { formatDate, formatMinutes } from "@/utils";
import { taskTypeConfig, priorityConfig, statusConfig } from "@/utils/taskConfig";

interface Props {
	task: Task;
	onClick?: () => void;
}

export default function TaskItem({ task, onClick }: Props) {
	const config = taskTypeConfig[task.type] ?? taskTypeConfig.other;
	const priority = priorityConfig[task.priority] ?? priorityConfig.medium;

	const status = statusConfig[task.status as keyof typeof statusConfig];
	const StatusIcon = status?.icon;

	const priorityLabel = priorityConfig[task.priority]?.label ?? task.priority;

	const TypeIcon = config.icon;

	const apartment = typeof task.apartmentId === "object" ? task.apartmentId : null;

	return (
		<div onClick={onClick} className="py-2 sm:p-4 flex items-center justify-between hover:bg-muted/30 transition cursor-pointer">
			<div className="flex items-center gap-4">
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

			<div className="flex items-center gap-4">
				<div className="hidden sm:block text-right">
					{task.priority && task.priority != "N/A" && <div className={`text-xs px-2 py-1 rounded-full inline-block capitalize ${priority.bg} ${priority.text}`}>{priorityLabel}</div>}

					<p className="text-sm font-medium mt-2 text-red-200">{formatDate(task.dueDate)}</p>
				</div>
				{StatusIcon && <StatusIcon className={`text-lg sm:text-2xl ${status.color}`} title={status.label} />}
			</div>
		</div>
	);
}
