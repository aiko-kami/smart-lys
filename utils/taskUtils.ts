import type { Task } from "@/types";

function startOfDay(date: Date) {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

function isSameDay(a: Date, b: Date) {
	return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function isBeforeDay(a: Date, b: Date) {
	return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function splitTasks(tasks: Task[]) {
	const today = new Date();

	const todayTasks: Task[] = [];
	const upcomingTasks: Task[] = [];
	const otherTasks: Task[] = [];

	for (const task of tasks) {
		const taskDate = new Date(task.dueDate);

		if (isSameDay(taskDate, today)) {
			todayTasks.push(task);
		} else if (isBeforeDay(today, taskDate)) {
			upcomingTasks.push(task);
		} else {
			otherTasks.push(task);
		}
	}

	// Tri chronologique
	todayTasks.sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));
	upcomingTasks.sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));
	otherTasks.sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));

	return { todayTasks, upcomingTasks, otherTasks };
}
