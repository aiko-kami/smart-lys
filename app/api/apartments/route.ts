import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getApartmentModel, getClientModel } from "@/lib/models";

export async function GET() {
	const conn = await connectDB();
	getClientModel(conn);
	const Apartment = getApartmentModel(conn);
	const apartments = await Apartment.find().populate("clientId", "name").sort({ name: 1 }).lean();
	return NextResponse.json(JSON.parse(JSON.stringify(apartments)));
}

export async function POST(req: NextRequest) {
	const body = await req.json();
	const conn = await connectDB();
	const Apartment = getApartmentModel(conn);

	const apartment = await Apartment.create(body);

	const populated = await apartment.populate("clientId", "name");

	return NextResponse.json(populated);
}
