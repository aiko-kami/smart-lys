"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { Task, Client, Apartment, Reservation } from "@/types";
import { splitTasks } from "@/utils/taskUtils";
import TasksTodayCard from "@/components/tasks/TasksTodayCard";
import UpcomingTasksCard from "@/components/tasks/UpcomingTasksCard";
import OtherTasksCard from "@/components/tasks/OtherTasksCard";
import TasksCalendarCard from "@/components/tasks/TasksCalendarCard";

import TaskDetailsModal from "@/components/tasks/TaskDetailsModal";
import TaskFormModal from "@/components/tasks/TaskFormModal";
import DeleteTaskModal from "@/components/tasks/DeleteTaskModal";

export default function TasksClient({ tasks: initial, clients, apartments, reservations }: { tasks: Task[]; clients: Client[]; apartments: Apartment[]; reservations: Reservation[] }) {
	const [tasks, setTasks] = useState(initial);
	const [allClients] = useState<Client[]>(clients);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [clientFilter, setClientFilter] = useState("all");
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [creating, setCreating] = useState(false);
	const [deleteModal, setDeleteModal] = useState<Task | null>(null);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { todayTasks, upcomingTasks, otherTasks } = useMemo(() => {
		return splitTasks(tasks);
	}, [tasks]);

	function openCreate() {
		setCreating(true);
	}

	function handleEdit(task: Task) {
		setSelectedTask(null);
		setEditingTask(task);
	}

	function handleDelete(task: Task) {
		setSelectedTask(null);
		setDeleteModal(task);
	}

	async function handleSave(data: Partial<Task>) {
		setError(null);
		try {
			const isEditing = !!editingTask?._id;

			// ── URL + method (même pattern que apartments)
			const url = isEditing ? `/api/tasks/${editingTask!._id}` : "/api/tasks";

			const method = isEditing ? "PUT" : "POST";
			const res = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				throw new Error(isEditing ? "Erreur lors de la modification" : "Erreur lors de la création");
			}

			const savedTask = await res.json();

			// ── update state (same pattern apartments)
			if (isEditing) {
				toast.success("Tâche mise à jour");
				setTasks((prev) => prev.map((t) => (t._id === savedTask._id ? savedTask : t)));
			} else {
				toast.success("Tâche créée");
				setTasks((prev) => [savedTask, ...prev]);
			}

			setEditingTask(null);
			setCreating(false);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Une erreur est survenue");
			toast.error(e instanceof Error ? e.message : "Une erreur est survenue");
		}
	}

	async function handleDeleteConfirm() {
		if (!deleteModal) return;

		setDeleting(true);
		setError(null);

		try {
			const res = await fetch(`/api/tasks/${deleteModal._id}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				throw new Error("Erreur lors de la suppression");
			}
			toast.success("Tâche suprimée");
			setTasks((prev) => prev.filter((task) => task._id !== deleteModal._id));

			setDeleteModal(null);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Une erreur est survenue");
			toast.error(e instanceof Error ? e.message : "Une erreur est survenue");
		} finally {
			setDeleting(false);
		}
	}

	return (
		<div className="space-y-6">
			{/* HEADER */}
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold sm:text-3xl">Tâches</h1>

					<p className="mt-1 text-gray-400">Gérez les tâches et prestations à effectuer</p>
				</div>

				<button onClick={openCreate} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500">
					+ Nouvelle tâche
				</button>
			</div>

			{/* GRID */}
			<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
				{/* LEFT */}
				<div className="space-y-6 xl:col-span-2">
					<TasksTodayCard tasks={todayTasks} onTaskClick={setSelectedTask} />

					<UpcomingTasksCard tasks={upcomingTasks} onTaskClick={setSelectedTask} />

					<OtherTasksCard tasks={otherTasks} onTaskClick={setSelectedTask} />
				</div>

				{/* RIGHT */}
				<div>
					<TasksCalendarCard tasks={tasks} />
				</div>
			</div>

			{/* DETAILS MODAL */}
			{selectedTask && <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} onEdit={handleEdit} onDelete={handleDelete} />}

			{/* EDIT MODAL */}
			{(editingTask || creating) && (
				<TaskFormModal
					task={editingTask}
					onClose={() => {
						setEditingTask(null);
						setCreating(false);
					}}
					onSave={handleSave}
					clients={clients}
					apartments={apartments}
					reservations={reservations}
				/>
			)}

			{/* DELETE MODAL */}
			{deleteModal && <DeleteTaskModal task={deleteModal} deleting={deleting} onConfirm={handleDeleteConfirm} onClose={() => setDeleteModal(null)} />}
		</div>
	);
}
