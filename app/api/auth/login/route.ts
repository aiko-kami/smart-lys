import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getSettingsModel } from "@/lib/models/Settings";

import { verifyPin, createToken } from "@/lib/auth";

export async function POST(req: Request) {
	try {
		const body = await req.json();

		const conn = await connectDB();

		const Settings = getSettingsModel(conn);

		const settings = await Settings.findOne();

		if (!settings?.auth?.pinHash) {
			return NextResponse.json({ error: "PIN non configuré" }, { status: 500 });
		}

		const valid = await verifyPin(body.pin, settings.auth.pinHash);

		if (!valid) {
			return NextResponse.json({ error: "PIN invalide" }, { status: 401 });
		}

		const token = await createToken();

		const cookieStore = await cookies();

		cookieStore.set("smartlys_session", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 30,
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(error);

		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
