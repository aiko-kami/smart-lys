"use client";

import { useState, useMemo } from "react";
import type { Task, Client } from "@/types";
import { splitTasks } from "@/lib/utils/taskUtils";
import TasksTodayCard from "@/components/tasks/TasksTodayCard";
import UpcomingTasksCard from "@/components/tasks/UpcomingTasksCard";
import TasksCalendarCard from "@/components/tasks/TasksCalendarCard";

export default function TasksClient({ tasks: initial, clients }: { tasks: Task[]; clients: Client[] }) {
	const [tasks, setTasks] = useState(initial);

	const [allClients] = useState<Client[]>(clients);

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [clientFilter, setClientFilter] = useState("all");

	const { todayTasks, upcomingTasks } = useMemo(() => {
		return splitTasks(tasks);
	}, [tasks]);

	// ── Modals ─────────────────────────────
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [deleteModal, setDeleteModal] = useState<Task | null>(null);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// ── ACTIONS ─────────────────────────────
	function openCreate() {
		setSelectedTask(null);
		setModalOpen(true);
	}

	function handleEdit(inv: Task) {
		setSelectedTask(inv);
		setModalOpen(true);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold sm:text-3xl">Tâches</h1>
					<p className="mt-1 text-gray-400">Gérez les tâches et prestations à effectuer</p>
				</div>
				<button onClick={openCreate} className="rounded-xl bg-emerald-600 bg- px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500">
					+ Nouvelle tâche
				</button>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				{/* LEFT COLUMN */}
				<div className="xl:col-span-2 space-y-6">
					<TasksTodayCard />
					<UpcomingTasksCard />
				</div>

				{/* RIGHT COLUMN */}
				<div>
					<TasksCalendarCard />
				</div>
			</div>
		</div>
	);
}
