import type { Invoice, InvoiceStatus } from "@/types";

export function formatDate(date: string) {
	return new Date(date).toLocaleDateString("fr-FR");
}

export function formatStatus(status: InvoiceStatus) {
	const map: Record<InvoiceStatus, string> = {
		draft: "Brouillon",
		sent: "Envoyé",
		paid: "Payé",
		late: "En retard",
	};

	return map[status];
}

export function statusClass(status: InvoiceStatus) {
	const map: Record<InvoiceStatus, string> = {
		draft: "bg-gray-500/10 text-gray-400",
		sent: "bg-yellow-500/10 text-yellow-400",
		paid: "bg-green-500/10 text-green-400",
		late: "bg-red-500/10 text-red-400",
	};

	return map[status];
}

export function fmt(n: number) {
	return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/[\u202F\u00A0]/g, " ");
}
