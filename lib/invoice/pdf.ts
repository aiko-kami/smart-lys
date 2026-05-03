import { jsPDF } from "jspdf";
import type { Invoice } from "@/types";
import { formatMoney } from "./format";

export function generateInvoicePDF(invoice: Invoice) {
	const doc = new jsPDF({ unit: "mm", format: "a4" });

	const ml = 15;
	let y = 20;

	// HEADER
	doc.setFont("helvetica", "bold");
	doc.setFontSize(16);
	doc.text("FACTURE", ml, y);

	y += 10;

	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");

	doc.text(`N°: ${invoice.number}`, ml, y);
	y += 6;
	doc.text(`Date: ${new Date(invoice.date).toLocaleDateString("fr-FR")}`, ml, y);
	y += 6;

	doc.text(`Client: ${invoice.clientId.name}`, ml, y);

	// TABLE HEADER
	y += 12;

	doc.setFont("helvetica", "bold");
	doc.text("Description", ml, y);
	doc.text("Qté", 120, y);
	doc.text("PU", 140, y);
	doc.text("Total", 170, y);

	y += 8;

	// LINES
	doc.setFont("helvetica", "normal");

	invoice.lines.forEach((l) => {
		doc.text(l.description, ml, y);
		doc.text(String(l.quantity), 120, y);
		doc.text(formatMoney(l.unitPrice), 140, y);
		doc.text(formatMoney(l.total), 170, y);
		y += 7;
	});

	// TOTAL
	y += 10;
	doc.setFont("helvetica", "bold");
	doc.text(`TOTAL: ${formatMoney(invoice.total)} €`, 140, y);

	doc.save(`facture-${invoice.number}.pdf`);
}
