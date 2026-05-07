export type TaskType = "cleaning" | "checkin" | "checkout" | "maintenance" | "inspection" | "other";

export type TaskStatus = "pending" | "in_progress" | "done" | "cancelled";

export type TaskPriority = "low" | "medium" | "high";

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
	apartmentId?: string | TaskApartment;
	clientId?: string | TaskClient;
	dueDate: string;
	startDate?: string;
	status: TaskStatus;
	priority: TaskPriority;
	notes?: string;
	createdAt?: string;
	updatedAt?: string;
}
