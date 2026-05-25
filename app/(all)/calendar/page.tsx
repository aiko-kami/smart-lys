import { connectDB } from "@/lib/mongodb";

import CalendarClient from "@/components/calendar/CalendarClient";

import { registerModels, getReservationModel, getApartmentModel } from "@/lib/models";

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

// ── PAGE ───────────────────────────

export default async function CalendarPage() {
	const [reservations, apartments] = await Promise.all([getReservations(), getApartments()]);

	const events = reservations.map((r: any) => ({
		id: r._id,
		title: r.guestName,
		start: r.checkIn,
		end: r.checkOut,
		type: "reservation",
		apartment: r.apartmentId,
		platform: r.platform,
	}));

	return <CalendarClient events={events} apartments={apartments} />;
}
