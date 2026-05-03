import { connectDB } from "@/lib/mongodb";
import { getClientModel } from "@/lib/models";
import ClientsClient from "@/components/clients/ClientsClient";

async function getClients() {
	console.log("1. Starting ClientsPage");
	const conn = await connectDB();
	console.log("2. DB connected");

	const Client = getClientModel(conn);
	console.log("3. Model ready");

	const raw = await Client.find().sort({ name: 1 }).lean();
	console.log("4. Clients fetched:", raw.length);

	return JSON.parse(JSON.stringify(raw));
}

export default async function ClientsPage() {
	const clients = await getClients();
	return <ClientsClient clients={clients} />;
}
