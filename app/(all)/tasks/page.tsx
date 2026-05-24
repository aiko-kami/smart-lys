import { connectDB } from "@/lib/mongodb";
import TasksClient from "@/components/tasks/TasksClient";
import { registerModels, getTaskModel, getClientModel, getApartmentModel, getReservationModel } from "@/lib/models";

async function getTasks() {
	const conn = await connectDB();

	registerModels(conn);

	const Task = getTaskModel(conn);

	const tasks = await Task.find()
		.populate("clientId", "name address")
		.populate("apartmentId", "name address")
		.populate("reservationId", "apartmentId guestName checkIn checkOut")
		.sort({ date: -1 })
		.lean();

	return JSON.parse(JSON.stringify(tasks));
}

async function getClients() {
	const conn = await connectDB();

	registerModels(conn);

	const Client = getClientModel(conn);

	const clients = await Client.find().sort({ name: 1 }).lean();

	return JSON.parse(JSON.stringify(clients));
}

async function getApartments() {
	const conn = await connectDB();

	registerModels(conn);

	const Apartment = getApartmentModel(conn);

	const apartments = await Apartment.find().sort({ name: 1 }).lean();

	return JSON.parse(JSON.stringify(apartments));
}

async function getReservations() {
	const conn = await connectDB();

	registerModels(conn);

	const Reservation = getReservationModel(conn);

	const reservations = await Reservation.find().sort({ checkIn: 1 }).lean();

	return JSON.parse(JSON.stringify(reservations));
}

export const dynamic = "force-dynamic";

export default async function TasksPage() {
	const [tasks, clients, apartments, reservations] = await Promise.all([getTasks(), getClients(), getApartments(), getReservations()]);

	return <TasksClient tasks={tasks} clients={clients} apartments={apartments} reservations={reservations} />;
}
