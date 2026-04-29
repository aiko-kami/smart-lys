import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		await connectDB();
		return NextResponse.json({ ok: true, message: "MongoDB connecté ✓" });
	} catch (e) {
		return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
	}
}
