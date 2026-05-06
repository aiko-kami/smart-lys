import { connectDB } from "@/lib/mongodb";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { getInvoiceModel, getPaymentModel } from "@/lib/models";
import { invoiceTemplate } from "@/lib/pdf/templates/invoiceTemplate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		const conn = await connectDB();
		const Invoice = getInvoiceModel(conn);
		const Payment = getPaymentModel(conn);

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
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath(),
			headless: chromium.headless,
		});

		const page = await browser.newPage();

		await page.setContent(html, {
			waitUntil: "networkidle0",
		});

		const pdf = await page.pdf({
			format: "A4",
			printBackground: true,
		});

		await browser.close();

		return new Response(pdf, {
			status: 200,
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `inline; filename=invoice-${invoice.number}.pdf`,
			},
		});
	} catch (error) {
		console.error(error);

		return new Response("Failed to generate PDF", {
			status: 500,
		});
	}
}
