import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getClientModel } from "@/lib/models";

export async function GET() {
	const conn = await connectDB();
	const Client = getClientModel(conn);
	const clients = await Client.find().sort({ name: 1 }).lean();
	return NextResponse.json(JSON.parse(JSON.stringify(clients)));
}

export async function POST(req: NextRequest) {
	const body = await req.json();
	const conn = await connectDB();
	const Client = getClientModel(conn);
	const client = await Client.create(body);
	return NextResponse.json(JSON.parse(JSON.stringify(client)), { status: 201 });
}
