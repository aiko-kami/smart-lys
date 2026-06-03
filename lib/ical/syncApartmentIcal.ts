import { fetchIcalEvents } from "./fetchIcalEvents";
import { mapIcalEventToReservation } from "./mapIcalEventToReservation";

/**
 * Convert iCal error codes into readable UI messages
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

export async function syncApartmentIcal(Reservation: any, Apartment: any, apartment: any) {
	const now = new Date();

	// ─────────────────────────────────────────
	// 1. Pas d'URL
	// ─────────────────────────────────────────
	if (!apartment?.airbnbIcalUrl) {
		await Apartment.findByIdAndUpdate(apartment?._id, {
			$set: {
				lastSyncAt: now,
				lastSyncError: "NO_URL",
			},
		});

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
		const seenUids = new Set<string>();

		// ─────────────────────────────────────────
		// 3. Upsert reservations
		// ─────────────────────────────────────────
		for (const event of events) {
			const payload = mapIcalEventToReservation(event, apartment._id, "airbnb");

			seenUids.add(payload.icalUid);

			const reservation = await Reservation.findOneAndUpdate(
				{ icalUid: payload.icalUid },
				{
					$set: {
						checkIn: payload.checkIn,
						checkOut: payload.checkOut,
						nights: payload.nights,
						lastSyncAt: now,
						platform: payload.platform,
						missingFromSync: false,
						missingFromSyncAt: null,
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
				{ upsert: true, returnDocument: "after" },
			);

			synced.push(reservation);
		}

		// ─────────────────────────────────────────
		// 4. MARK: réservations absentes du flux iCal
		// ─────────────────────────────────────────
		// On ne touche qu'aux réservations importées avec un icalUid valide,
		// non archivées, non déjà annulées, et absentes du flux cette fois-ci.
		// On ne réécrit pas missingFromSyncAt si déjà flaggée (préserve la date initiale).
		await Reservation.updateMany(
			{
				apartmentId: apartment._id,
				platform: "airbnb",
				isImported: true,
				icalUid: { $nin: Array.from(seenUids), $ne: "" },
				isArchived: { $ne: true },
				status: { $ne: "cancelled" },
				missingFromSync: { $ne: true },
			},
			{
				$set: {
					missingFromSync: true,
					missingFromSyncAt: now,
				},
			},
		);

		// ─────────────────────────────────────────
		// 5. Mise à jour de l'appartement
		// ─────────────────────────────────────────
		await Apartment.findByIdAndUpdate(apartment._id, {
			$set: {
				lastSyncAt: now,
				lastSyncSuccessAt: now,
				lastSyncError: null,
			},
		});

		// ─────────────────────────────────────────
		// 6. Success response
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
		// 7. Error response
		// ─────────────────────────────────────────
		const code = err?.code || err?.reason || err?.message || "UNKNOWN_ERROR";

		await Apartment.findByIdAndUpdate(apartment?._id, {
			$set: {
				lastSyncAt: now,
				lastSyncError: code,
			},
		});

		return {
			apartmentId: apartment?._id,
			apartmentName: apartment?.name,
			synced: [],
			error: code,
			message: `${apartment?.name || "Appartement"}:\n${formatIcalError(code)}`,
		};
	}
}
