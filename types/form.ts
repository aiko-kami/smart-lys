import type { Client } from "./client";

// ── Client form state ────────────────────────────────

export interface ClientFormData {
	name: string;
	email: string;
	phone: string;
	address: string;
	description: string;
	startDate: string;
}

// used in modal props
export interface ClientFormModalProps {
	client: Client | null;
	onClose: () => void;
	onSave: (data: Partial<Client>) => Promise<void>;
}
