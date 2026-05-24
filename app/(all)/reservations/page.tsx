import { connectDB } from "@/lib/mongodb";

import ReservationsClient from "@/components/reservations/ReservationsClient";

import { registerModels, getReservationModel, getApartmentModel, getClientModel } from "@/lib/models";

// ── RESERVATIONS ─────────────────────────

async function getReservations() {
	const conn = await connectDB();
	registerModels(conn);
	const Reservation = getReservationModel(conn);
	const reservations = await Reservation.find().sort({ checkIn: 1 }).populate("apartmentId", "name image address clientId").lean();
	return JSON.parse(JSON.stringify(reservations));
}

// ── APARTMENTS ───────────────────────────

async function getApartments() {
	const conn = await connectDB();

	registerModels(conn);

	const Apartment = getApartmentModel(conn);

	const apartments = await Apartment.find().sort({ name: 1 }).lean();

	return JSON.parse(JSON.stringify(apartments));
}

// ── CLIENTS ───────────────────────────

async function getClients() {
	const conn = await connectDB();

	registerModels(conn);

	const Client = getClientModel(conn);

	const clients = await Client.find().sort({ name: 1 }).lean();

	return JSON.parse(JSON.stringify(clients));
}

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
	const [reservations, apartments, clients] = await Promise.all([getReservations(), getApartments(), getClients()]);

	return <ReservationsClient reservations={reservations} apartments={apartments} clients={clients} />;
}
