import React from "react";
import fs from "fs";
import path from "path";

import { connectDB } from "@/lib/mongodb";
import { getInvoiceModel, getPaymentModel, getClientModel } from "@/lib/models";

import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePdf } from "@/lib/pdf/InvoicePdf";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const conn = await connectDB();
	const Invoice = getInvoiceModel(conn);
	const Payment = getPaymentModel(conn);
	const Client = getClientModel(conn);

	const invoice = await Invoice.findById(id).populate("clientId").lean();
	if (!invoice) {
		return new Response("Invoice not found", { status: 404 });
	}

	const payment = await Payment.findOne().lean();
	if (!payment) {
		return new Response("Payment not found", { status: 404 });
	}

	const logoPath = path.join(process.cwd(), "public/images/logo-conciergerie-dulys.png");
	const logoBase64 = fs.existsSync(logoPath) ? `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}` : null;

	const pdfBuffer = await renderToBuffer(React.createElement(InvoicePdf, { invoice, payment, logoBase64 }));

	return new Response(new Uint8Array(pdfBuffer), {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `inline; filename=invoice-${invoice.number}.pdf`,
		},
	});
}
