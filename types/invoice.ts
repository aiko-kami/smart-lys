export type InvoiceStatus = "draft" | "sent" | "paid" | "late";

export interface InvoiceClient {
	_id: string;
	name: string;
	address?: string;
}

export interface InvoiceLine {
	description: string;
	quantity: number;
	unitPrice: number;
	total: number;
}

export interface Invoice {
	_id: string;
	number: string;
	clientId: string | InvoiceClient;
	date: string;
	dueDate?: string;
	lines: InvoiceLine[];
	total: number;
	status: InvoiceStatus;
	createdAt?: string;
	updatedAt?: string;
}
