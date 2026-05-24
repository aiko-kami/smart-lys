import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getReservationModel, getClientModel, getApartmentModel } from "@/lib/models";

export async function GET() {
	const conn = await connectDB();
	getClientModel(conn);
	getApartmentModel(conn);
	const Reservation = getReservationModel(conn);
	const reservations = await Reservation.find().sort({ createdAt: -1 }).populate("clientId", "name").populate("apartmentId", "name address image").lean();
	return NextResponse.json(JSON.parse(JSON.stringify(reservations)));
}

export async function POST(req: NextRequest) {
	const body = await req.json();

	console.log("🚀 ~ POST ~ body:", body);

	const conn = await connectDB();

	getClientModel(conn);
	getApartmentModel(conn);
	const Reservation = getReservationModel(conn);

	const reservation = await Reservation.create(body);

	const populated = await Reservation.findById(reservation._id).populate("apartmentId", "name address image").lean();

	return NextResponse.json(JSON.parse(JSON.stringify(populated)));
}
