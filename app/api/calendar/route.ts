import { NextRequest, NextResponse } from "next/server";
import ical from "node-ical";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);

	const url = searchParams.get("url");

	if (!url) {
		return NextResponse.json({ error: "Missing url" }, { status: 400 });
	}

	try {
		const data = await ical.async.fromURL(url);

		const events = Object.values(data)
			.filter((e: any) => e.type === "VEVENT")
			.map((event: any) => ({
				id: event.uid,
				title: event.summary,
				start: event.start,
				end: event.end,
				description: event.description,
			}));

		return NextResponse.json(events);
	} catch (err) {
		return NextResponse.json({ error: "Impossible de lire le calendrier" }, { status: 500 });
	}
}
