import { connectDB } from "@/lib/mongodb";

import ReservationsClient from "@/components/reservations/ReservationsClient";

import { registerModels, getReservationModel, getApartmentModel } from "@/lib/models";

// ── RESERVATIONS ─────────────────────────

async function getReservations() {
	const conn = await connectDB();

	registerModels(conn);

	const Reservation = getReservationModel(conn);

	const reservations = await Reservation.find().sort({ checkIn: 1 }).lean();

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

// ── PAGE ─────────────────────────────────

export default async function ReservationsPage() {
	const [reservations, apartments] = await Promise.all([getReservations(), getApartments()]);

	return <ReservationsClient reservations={reservations} apartments={apartments} />;
}
