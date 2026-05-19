import mongoose, { Schema } from "mongoose";

const SettingsSchema = new Schema(
	{
		auth: {
			pinHash: {
				type: String,
				default: "",
			},
		},
	},
	{
		collection: "settings",
		timestamps: true,
	},
);

export function getSettingsModel(conn: mongoose.Connection) {
	return conn.models.Settings || conn.model("Settings", SettingsSchema);
}
