import mongoose, { Schema } from "mongoose";

const ApartmentSchema = new Schema(
	{
		name: { type: String, required: true },
		address: { type: String, required: true },
		clientId: {
			type: Schema.Types.ObjectId,
			ref: "Client",
			required: true,
		},
		airbnbIcalUrl: { type: String, default: "" },
		description: { type: String, default: "" },
		image: { type: String, default: "" },
		keys: { type: String, default: "" },
		floor: { type: String, default: "" },
		beds: { type: String, default: "" },
		platform: {
			type: String,
			enum: ["airbnb", "booking", "direct", "other"],
			default: "other",
		},
		lastSyncAt: { type: Date, default: null },
		lastSyncSuccessAt: { type: Date, default: null },
		lastSyncError: { type: String, default: null },
	},
	{ collection: "apartments", timestamps: true },
);

export function getApartmentModel(conn: mongoose.Connection) {
	return conn.models.Apartment || conn.model("Apartment", ApartmentSchema);
}
