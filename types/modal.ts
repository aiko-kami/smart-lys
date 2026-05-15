import type { Client } from "./client";
import type { Apartment } from "./apartment";
import type { Invoice } from "./invoice";
import type { Task } from "./task";

// ── Client delete modal ───────────────────────────────

export interface DeleteClientModalProps {
	client: Client;
	deleting: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

// ── Client details modal ───────────────────────────

export interface ClientDetailsModalProps {
	client: Client | null;
	onClose: () => void;
	onEdit: (client: Client) => void;
	onDelete: (client: Client) => void;
}

// ── Client form modal ─────────────────────────────
export interface ClientFormModalProps {
	client: Client | null;
	onClose: () => void;
	onSave: (data: Partial<Client>) => Promise<void>;
}

// ── Apartment delete modal ────────────────────────────

export interface DeleteApartmentModalProps {
	apartment: Apartment;
	deleting: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

// ── Apartment details modal ───────────────────────────

export interface ApartmentDetailsModalProps {
	apartment: Apartment | null;
	onClose: () => void;
	onEdit: (apt: Apartment) => void;
	onDelete: (apt: Apartment) => void;
}

// ── Apartment form modal ─────────────────────────────
export interface ApartmentFormModalProps {
	apartment: Apartment | null;
	onClose: () => void;
	onSave: (data: Partial<Apartment>) => Promise<void>;
}

// ── Invoice form modal ─────────────────────────────
export interface InvoiceFormModalProps {
	invoice: Invoice | null;
	clients: Client[];
	onClose: () => void;
	onSave: (data: Partial<Invoice>) => Promise<void>;
}

// ── Task details modal ───────────────────────────

export interface TaskDetailsModalProps {
	task: Task | null;
	onClose: () => void;
	onEdit: (task: Task) => void;
	onDelete: (task: Task) => void;
}

// ── Task form modal ─────────────────────────────
export interface TaskFormModalProps {
	task: Task | null;
	onClose: () => void;
	onSave: (data: Partial<Task>) => Promise<void>;
	clients: Client[];
	apartments: Apartment[];
}
