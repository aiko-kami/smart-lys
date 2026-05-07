import { connectDB } from "@/lib/mongodb";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { getInvoiceModel, getPaymentModel, getClientModel } from "@/lib/models";
import { invoiceTemplate } from "@/lib/pdf/templates/invoiceTemplate";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const isDev = process.env.NODE_ENV === "development";

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

	const html = invoiceTemplate(invoice, payment);

	const browser = await puppeteer.launch({
		args: isDev ? [] : chromium.args,
		executablePath: isDev ? undefined : await chromium.executablePath(),
		headless: true,
		channel: isDev ? "chrome" : undefined,
	});

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
