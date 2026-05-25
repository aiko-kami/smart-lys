import { parseIcalDate } from "./parseIcalDate";
import { calcNights } from "./calcNights";

export function mapIcalEventToReservation(event: any, apartmentId: string, platform: string = "airbnb") {
	const checkIn = parseIcalDate(event.start, "start");

	const checkOut = parseIcalDate(event.end, "end");

	if (!checkIn || !checkOut) {
		throw new Error("Invalid iCal dates");
	}

	return {
		apartmentId,
		guestName: event.title || "Imported reservation",
		checkIn,
		checkOut,
		nights: calcNights(checkIn, checkOut),
		platform,
		icalUid: event.uid,
		isImported: true,
		lastSyncAt: new Date(),
		status: "confirmed",
	};
}
