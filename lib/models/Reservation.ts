import mongoose, { Schema, model, models } from "mongoose";

const ReservationSchema = new Schema(
	{
		apartmentId: {
			type: Schema.Types.ObjectId,
			ref: "Apartment",
			required: true,
		},
		guestName: { type: String, required: true, trim: true },
		guestEmail: { type: String, default: "", trim: true, lowercase: true },
		phone: { type: String, default: "", trim: true },
		checkIn: { type: Date, required: true },
		checkOut: { type: Date, required: true },
		nights: { type: Number, required: true },
		source: {
			type: String,
			enum: ["airbnb", "direct", "other"],
			default: "direct",
		},
		status: {
			type: String,
			enum: ["pending", "confirmed", "cancelled", "completed"],
			default: "pending",
		},
		notes: { type: String, default: "" },
	},
	{ timestamps: true },
);

export function getReservationModel(conn: mongoose.Connection) {
	return conn.models.Reservation || conn.model("Reservation", ReservationSchema);
}
