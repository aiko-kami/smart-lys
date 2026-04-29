import mongoose, { Schema, model, models } from "mongoose";

const ReservationSchema = new Schema(
	{
		apartmentId: {
			type: Schema.Types.ObjectId,
			ref: "Apartment",
			required: true,
		},
		guestName: { type: String, required: true },
		guestEmail: { type: String, default: "" },
		checkIn: { type: Date, required: true },
		checkOut: { type: Date, required: true },
		nights: { type: Number, required: true },
		source: {
			type: String,
			enum: ["airbnb", "direct", "other"],
			default: "direct",
		},
	},
	{ timestamps: true },
);

export const ReservationModel = models.Reservation || model("Reservation", ReservationSchema);
