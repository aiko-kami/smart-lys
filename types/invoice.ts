export type InvoiceStatus = "draft" | "sent" | "paid" | "late";

export interface InvoiceClient {
	_id: string;
	name: string;
	address?: string;
	company?: string;
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
	title?: string;
	removeName: boolean;
	date: string;
	dueDate?: string;
	lines: InvoiceLine[];
	total: number;
	status: InvoiceStatus;
	paymentMode?: string;
	createdAt?: string;
	updatedAt?: string;
}
