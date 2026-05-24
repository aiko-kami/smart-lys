import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getReservationModel, getClientModel, getApartmentModel } from "@/lib/models";

// ─── UPDATE reservation ─────────────────────────────────────────────

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const body = await req.json();
	const conn = await connectDB();

	// register models (important pour populate)
	getClientModel(conn);
	getApartmentModel(conn);
	const Reservation = getReservationModel(conn);

	const updated = await Reservation.findByIdAndUpdate(id, body, {
		new: true,
	})
		.populate("apartmentId", "name address image")
		.lean();

	if (!updated) {
		return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 });
	}

	return NextResponse.json(JSON.parse(JSON.stringify(updated)));
}

// ─── DELETE reservation ─────────────────────────────────────────────

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const conn = await connectDB();
	const Reservation = getReservationModel(conn);

	await Reservation.findByIdAndDelete(id);

	return NextResponse.json({ ok: true });
}
