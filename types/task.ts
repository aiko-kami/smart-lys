export type TaskType = "cleaning" | "checkin" | "checkout" | "maintenance" | "inspection" | "chloe" | "amy" | "adrian" | "other";

export type TaskStatus = "pending" | "in_progress" | "done" | "cancelled" | "N/A";

export type TaskPriority = "low" | "medium" | "high" | "N/A";

export interface TaskClient {
	_id: string;
	name: string;
	address?: string;
}

export interface TaskApartment {
	_id: string;
	name: string;
}

export interface Task {
	_id: string;
	title: string;
	description?: string;
	type: TaskType;
	apartmentId?: string | TaskApartment | null;
	clientId?: string | TaskClient | null;
	dueDate: string;
	startDate?: string;
	duration?: number;
	status: TaskStatus;
	priority: TaskPriority;
	notes?: string;
	createdAt?: string;
	updatedAt?: string;
}
