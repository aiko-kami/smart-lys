import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { registerModels, getApartmentModel, getReservationModel, getSettingsModel } from "@/lib/models";
import { syncApartmentIcal } from "@/lib/ical";

export async function POST() {
	try {
		const conn = await connectDB();
		registerModels(conn);

		const Apartment = getApartmentModel(conn);
		const Reservation = getReservationModel(conn);
		const Settings = getSettingsModel(conn);

		const apartments = await Apartment.find({
			airbnbIcalUrl: { $ne: "" },
		}).lean();

		let totalSynced = 0;
		let totalErrors = 0;
		const results: any[] = [];

		for (const apartment of apartments) {
			console.log("🔄 Sync iCal:", apartment.name);

			const result = await syncApartmentIcal(Reservation, Apartment, apartment);

			results.push(result);

			if (Array.isArray(result.synced)) {
				totalSynced += result.synced.length;
			}

			if (result.error && result.error !== "NO_URL") {
				totalErrors += 1;
			}
		}

		const successMessages = results.filter((r) => !r.error).map((r) => r.message);
		const errorMessages = results.filter((r) => r.error).map((r) => r.message);

		const syncStatus = totalErrors > 0 ? "error" : "success";
		const syncMessage = `${totalSynced} sync • ${totalErrors} erreur${totalErrors > 1 ? "s" : ""}`;

		await Settings.updateOne(
			{},
			{
				$set: {
					"sync.lastAirbnbSyncAt": new Date(),
					"sync.lastSyncedApartmentsCount": apartments.length,
					"sync.lastSyncedReservationsCount": totalSynced,
					"sync.lastAirbnbSyncStatus": syncStatus,
					"sync.lastAirbnbSyncMessage": syncMessage,
				},
			},
			{ upsert: true },
		);

		return NextResponse.json({
			success: true,
			summary: {
				apartments: apartments.length,
				synced: totalSynced,
				errors: totalErrors,
			},
			successMessages,
			errorMessages,
			results,
		});
	} catch (e) {
		console.error("ICAL_SYNC_ERROR", e);

		return NextResponse.json(
			{
				success: false,
				error: "Sync failed",
				summary: { apartments: 0, synced: 0, errors: 1 },
				successMessages: [],
				errorMessages: ["Erreur critique de synchronisation iCal"],
				results: [],
			},
			{ status: 500 },
		);
	}
}
