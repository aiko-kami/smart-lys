import type { Invoice } from "@/types";
import { formatDate } from "@/utils";

export function filterInvoices(invoices: Invoice[], search: string, statusFilter: string) {
	const q = search.toLowerCase().trim();

	return invoices.filter((i) => {
		const date = formatDate(i.date);
		const due = formatDate(i.dueDate);

		const matchSearch =
			i.number.toLowerCase().includes(q) ||
			i.clientId.name.toLowerCase().includes(q) ||
			i.status.toLowerCase().includes(q) ||
			i.total.toString().includes(q) ||
			(date !== "—" && date.toLowerCase().includes(q)) ||
			(due !== "—" && due.toLowerCase().includes(q));

		const matchStatus = statusFilter === "all" || i.status === statusFilter;

		return matchSearch && matchStatus;
	});
}
