import { connectDB } from "@/lib/mongodb";
import { getInvoiceModel, getPaymentModel } from "@/lib/models";
import puppeteer from "puppeteer";
import { invoiceTemplate } from "@/lib/pdf/templates/invoiceTemplate";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const conn = await connectDB();
	const Invoice = getInvoiceModel(conn);
	const Payment = getPaymentModel(conn);

	const invoice = await Invoice.findById(id).populate("clientId").lean();

	console.log("🚀 ~ GET ~ invoice:", invoice);

	if (!invoice) {
		return new Response("Not found", { status: 404 });
	}

	const payment = await Payment.findOne().lean();

	const html = invoiceTemplate(invoice, payment);

	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.setContent(html, { waitUntil: "networkidle0" });

	const pdf = await page.pdf({ format: "A4", printBackground: true });

	await browser.close();

	return new Response(new Uint8Array(pdf).buffer, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": `inline; filename=invoice-${invoice.number}.pdf`,
		},
	});
}
