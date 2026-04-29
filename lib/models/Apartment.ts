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
		status: {
			type: String,
			enum: ["available", "occupied", "maintenance"],
			default: "available",
		},
	},
	{ collection: "apartments", timestamps: true },
);

export function getApartmentModel(conn: mongoose.Connection) {
	return conn.models.Apartment || conn.model("Apartment", ApartmentSchema);
}
