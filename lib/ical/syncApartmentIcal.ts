import { fetchIcalEvents } from "./fetchIcalEvents";
import { mapIcalEventToReservation } from "./mapIcalEventToReservation";

/**
 * Convertit les codes d’erreur iCal en messages lisibles UI
 */
function formatIcalError(code: string) {
	switch (code) {
		case "NO_URL":
			return "Aucune URL iCal configurée";

		case "INVALID_URL":
			return "URL iCal invalide";

		case "HTTP_404":
			return "Lien iCal introuvable";

		case "HTTP_403":
			return "Accès refusé par le fournisseur iCal";

		case "HTTP_500":
			return "Erreur serveur iCal";

		case "INVALID_ICAL_FORMAT":
			return "Format iCal invalide";

		default:
			return "Erreur inconnue lors de la synchronisation iCal";
	}
}

export async function syncApartmentIcal(Reservation: any, apartment: any) {
	// ─────────────────────────────────────────
	// 1. Pas d’URL
	// ─────────────────────────────────────────
	if (!apartment?.airbnbIcalUrl) {
		return {
			apartmentId: apartment?._id,
			apartmentName: apartment?.name,
			synced: [],
			error: "NO_URL",
			message: "Aucune URL iCal configurée",
		};
	}

	try {
		// ─────────────────────────────────────────
		// 2. Fetch iCal
		// ─────────────────────────────────────────
		const events = await fetchIcalEvents(apartment.airbnbIcalUrl, apartment.name);

		const synced: any[] = [];

		// ─────────────────────────────────────────
		// 3. Upsert reservations
		// ─────────────────────────────────────────
		for (const event of events) {
			const payload = mapIcalEventToReservation(event, apartment._id, "airbnb");
			const reservation = await Reservation.findOneAndUpdate(
				{ icalUid: payload.icalUid },
				{
					$set: {
						checkIn: payload.checkIn,
						checkOut: payload.checkOut,
						nights: payload.nights,
						lastSyncAt: payload.lastSyncAt,
						platform: payload.platform,
					},

					$setOnInsert: {
						apartmentId: payload.apartmentId,
						guestName: payload.guestName,
						guestEmail: "",
						guestPhone: "",
						status: payload.status,
						notes: "",
						isImported: true,
						icalUid: payload.icalUid,
					},
				},
				{
					upsert: true,
					returnDocument: "after",
				},
			);

			synced.push(reservation);
		}

		// ─────────────────────────────────────────
		// 4. Success response
		// ─────────────────────────────────────────
		return {
			apartmentId: apartment._id,
			apartmentName: apartment.name,
			synced,
			error: null,
			message: `${synced.length} réservation${synced.length > 1 ? "s" : ""} synchronisée${synced.length > 1 ? "s" : ""}`,
		};
	} catch (err: any) {
		// ─────────────────────────────────────────
		// 5. Error response propre et stable
		// ─────────────────────────────────────────
		const code = err?.code || err?.reason || "UNKNOWN_ERROR";

		return {
			apartmentId: apartment?._id,
			apartmentName: apartment?.name,
			synced: [],
			error: code,
			message: `${apartment?.name || "Appartement"}:\n${formatIcalError(code)}`,
		};
	}
}
