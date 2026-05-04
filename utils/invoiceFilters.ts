import type { Invoice } from "@/types";
import { formatDate } from "@/utils";

function getClientName(clientId: string | { name: string } | undefined) {
	if (!clientId) return "";
	if (typeof clientId === "string") return "";
	return clientId.name ?? "";
}

export function filterInvoices(invoices: Invoice[], search: string, statusFilter: string) {
	const q = search.toLowerCase().trim();

	return invoices.filter((i) => {
		const date = formatDate(i.date);
		const due = formatDate(i.dueDate);

		const clientName = getClientName(i.clientId);

		const matchSearch =
			i.number.toLowerCase().includes(q) ||
			clientName.toLowerCase().includes(q) ||
			i.status.toLowerCase().includes(q) ||
			i.total.toString().includes(q) ||
			date.toLowerCase().includes(q) ||
			due.toLowerCase().includes(q);

		const matchStatus = statusFilter === "all" || i.status === statusFilter;

		return matchSearch && matchStatus;
	});
}
