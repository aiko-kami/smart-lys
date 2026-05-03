import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getClientModel } from "@/lib/models";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const body = await req.json();
	const conn = await connectDB();
	const Client = getClientModel(conn);
	const updated = await Client.findByIdAndUpdate(id, body, { returnDocument: "after" }).lean();
	if (!updated) return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
	return NextResponse.json(JSON.parse(JSON.stringify(updated)));
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const conn = await connectDB();
	const Client = getClientModel(conn);
	await Client.findByIdAndDelete(id);
	return NextResponse.json({ ok: true });
}
