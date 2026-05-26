import mongoose, { Schema } from "mongoose";

const SettingsSchema = new Schema(
	{
		auth: {
			pinHash: { type: String, default: "" },
		},
		sync: {
			lastAirbnbSyncAt: { type: Date, default: null },
			lastAirbnbSyncStatus: { type: String, enum: ["success", "error", "idle"], default: "idle" },
			lastAirbnbSyncMessage: { type: String, default: "" },
			lastSyncedApartmentsCount: { type: Number, default: 0 },
			lastSyncedReservationsCount: { type: Number, default: 0 },
		},
	},
	{ collection: "settings", timestamps: true },
);

export function getSettingsModel(conn: mongoose.Connection) {
	return conn.models.Settings || conn.model("Settings", SettingsSchema);
}
