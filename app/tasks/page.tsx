import { connectDB } from "@/lib/mongodb";
import TasksClient from "@/components/tasks/TasksClient";
import { registerModels, getTaskModel, getClientModel } from "@/lib/models";

async function getTasks() {
	const conn = await connectDB();

	registerModels(conn);

	const Task = getTaskModel(conn);

	const tasks = await Task.find().populate("clientId", "name address").populate("apartmentId", "name address").sort({ date: -1 }).lean();

	return JSON.parse(JSON.stringify(tasks));
}

async function getClients() {
	const conn = await connectDB();

	registerModels(conn);

	const Client = getClientModel(conn);

	const clients = await Client.find().sort({ name: 1 }).lean();

	return JSON.parse(JSON.stringify(clients));
}

export default async function TasksPage() {
	const [tasks, clients] = await Promise.all([getTasks(), getClients()]);

	return <TasksClient tasks={tasks} clients={clients} />;
}
