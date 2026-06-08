import { connectDB } from "@/lib/mongodb";
import InvoicesClient from "@/components/invoices/InvoicesClient";
import { registerModels, getInvoiceModel, getClientModel, getPaymentModel } from "@/lib/models";

async function getInvoices() {
	const conn = await connectDB();

	registerModels(conn);

	const Invoice = getInvoiceModel(conn);

	const invoices = await Invoice.find().populate("clientId", "name address company").sort({ date: -1 }).lean();

	return JSON.parse(JSON.stringify(invoices));
}

async function getClients() {
	const conn = await connectDB();

	registerModels(conn);

	const Client = getClientModel(conn);

	const clients = await Client.find().sort({ name: 1 }).lean();

	return JSON.parse(JSON.stringify(clients));
}

async function getPayment() {
	const conn = await connectDB();

	registerModels(conn);

	const Payment = getPaymentModel(conn);

	const payment = await Payment.findOne().lean();

	return JSON.parse(JSON.stringify(payment));
}

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
	const [invoices, clients, payment] = await Promise.all([getInvoices(), getClients(), getPayment()]);

	return <InvoicesClient invoices={invoices} clients={clients} payment={payment} />;
}
