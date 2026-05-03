import type { InvoiceLine } from "@/types";

export function calcLineTotal(qty: number, price: number) {
	return qty * price;
}

export function calcInvoiceTotal(lines: InvoiceLine[]) {
	return lines.reduce((sum, l) => sum + l.total, 0);
}
