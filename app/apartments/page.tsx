import ICAL from "ical.js";
import { connectDB } from "@/lib/mongodb";
import { getApartmentModel, getClientModel } from "@/lib/models";
import ApartmentsClient from "@/components/apartments/ApartmentsClient";

async function isOccupiedToday(icalUrl: string): Promise<boolean> {
	// Don't even try if URL is empty or a placeholder
	if (!icalUrl || !icalUrl.startsWith("http")) return false;

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 5000);

		const res = await fetch(icalUrl, { signal: controller.signal });
		clearTimeout(timeout);

		const text = await res.text();
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const events = [...text.matchAll(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g)];
		return events.some((match) => {
			const block = match[0];
			const startStr = block.match(/DTSTART[^:]*:(\d{8})/)?.[1];
			const endStr = block.match(/DTEND[^:]*:(\d{8})/)?.[1];
			if (!startStr || !endStr) return false;
			const start = new Date(`${startStr.slice(0, 4)}-${startStr.slice(4, 6)}-${startStr.slice(6, 8)}`);
			const end = new Date(`${endStr.slice(0, 4)}-${endStr.slice(4, 6)}-${endStr.slice(6, 8)}`);
			return start <= today && end > today;
		});
	} catch {
		return false;
	}
}

async function getApartments() {
	const conn = await connectDB();
	getClientModel(conn);
	const Apartment = getApartmentModel(conn);
	const apartments = await Apartment.find().populate("clientId", "name").sort({ name: 1 }).lean();

	const serialized = JSON.parse(JSON.stringify(apartments));

	const withStatus = await Promise.all(
		serialized.map(async (apt: any) => {
			if (!apt.airbnbIcalUrl) return { ...apt, occupied: false };
			const occupied = await isOccupiedToday(apt.airbnbIcalUrl);
			return { ...apt, occupied };
		}),
	);

	return withStatus;
}

export default async function ApartmentsPage() {
	const conn = await connectDB();

	getClientModel(conn);
	const Apartment = getApartmentModel(conn);

	const raw = await Apartment.find().populate("clientId", "name").sort({ name: 1 }).lean();

	// Serialize + mark all as available until real iCal URLs are set
	const apartments = JSON.parse(JSON.stringify(raw)).map((apt: any) => ({
		...apt,
		occupied: false,
	}));

	return <ApartmentsClient apartments={apartments} />;
}
