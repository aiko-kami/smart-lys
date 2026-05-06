import { connectDB } from "@/lib/mongodb";
import { getClientModel } from "@/lib/models";
import ClientsClient from "@/components/clients/ClientsClient";

async function getClients() {
	const conn = await connectDB();
	const Client = getClientModel(conn);
	const raw = await Client.find().sort({ name: 1 }).lean();
	return JSON.parse(JSON.stringify(raw));
}

export default async function ClientsPage() {
	const clients = await getClients();
	return <ClientsClient clients={clients} />;
}
