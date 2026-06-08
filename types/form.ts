import type { Client } from "./client";

// ── Client form state ────────────────────────────────

export interface ClientFormData {
	name: string;
	email: string;
	phone: string;
	address: string;
	company: string;
	description: string;
	startDate: string;
}
