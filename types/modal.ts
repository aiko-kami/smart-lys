import type { Client } from "./client";
import type { Apartment } from "./apartment";

// ── Client delete modal ───────────────────────────────

export interface DeleteClientModalProps {
	client: Client;
	deleting: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

// ── Apartment delete modal ────────────────────────────

export interface DeleteApartmentModalProps {
	apartment: Apartment;
	deleting: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}
