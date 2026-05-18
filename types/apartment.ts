import type { Platform } from "@/types";

// ── Client reference ─────────────────────────────
export interface ClientRef {
	_id: string;
	name: string;
}

// ── Apartment ─────────────────────────────
export interface Apartment {
	_id: string;
	name: string;
	address: string;
	clientId: string | ClientRef;
	platform: Platform;
	airbnbIcalUrl?: string;
	description?: string;
	image?: string;
	keys?: string;
	floor?: string;
	beds?: string;
	occupied?: boolean;
}

// ── Props ─────────────────────────────
export interface ApartmentsClientProps {
	apartments: Apartment[];
}
