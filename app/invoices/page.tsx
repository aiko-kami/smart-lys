import { connectDB } from "@/lib/mongodb";
import InvoiceClient from "@/components/invoices/InvoiceClient";
import { registerModels, getInvoiceModel, getClientModel } from "@/lib/models";

async function getInvoices() {
	const conn = await connectDB();

	registerModels(conn);

	const Invoice = getInvoiceModel(conn);

	const invoices = await Invoice.find().populate("clientId", "name address").sort({ createdAt: -1 }).lean();

	return JSON.parse(JSON.stringify(invoices));
}

async function getClients() {
	const conn = await connectDB();

	registerModels(conn);

	const Client = getClientModel(conn);

	const clients = await Client.find().sort({ name: 1 }).lean();

	return JSON.parse(JSON.stringify(clients));
}

export default async function InvoicesPage() {
	const [invoices, clients] = await Promise.all([getInvoices(), getClients()]);

	return <InvoiceClient invoices={invoices} clients={clients} />;
}
