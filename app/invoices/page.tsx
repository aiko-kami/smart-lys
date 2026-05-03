import { connectDB } from "@/lib/mongodb";
import InvoiceClient from "@/components/invoices/InvoiceClient";
import { registerModels, getInvoiceModel } from "@/lib/models";

async function getInvoices() {
	const conn = await connectDB();

	registerModels(conn);

	const Invoice = getInvoiceModel(conn);

	const invoices = await Invoice.find().populate("clientId", "name").sort({ createdAt: -1 }).lean();

	return JSON.parse(JSON.stringify(invoices));
}

export default async function InvoicesPage() {
	const invoices = await getInvoices();

	return <InvoiceClient invoices={invoices} />;
}
