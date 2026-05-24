import mongoose, { Schema } from "mongoose";

const ReservationSchema = new Schema(
	{
		apartmentId: { type: Schema.Types.ObjectId, ref: "Apartment", required: true, index: true },
		guestName: { type: String, required: true, trim: true },
		guestEmail: { type: String, default: "", trim: true, lowercase: true },
		guestPhone: { type: String, default: "", trim: true },
		guests: { type: Number, default: 1, min: 1 },
		checkIn: { type: Date, required: true, index: true },
		checkOut: { type: Date, required: true, index: true },
		nights: { type: Number, required: true, min: 1 },
		arrivalTime: { type: String, default: "" },
		departureTime: { type: String, default: "" },
		platform: { type: String, enum: ["airbnb", "booking", "direct", "other"], default: "other", index: true },
		totalAmount: { type: Number, default: 0 },
		currency: { type: String, default: "EUR" },
		externalId: { type: String, default: "" },
		icalUid: { type: String, default: "", index: true },
		isImported: { type: Boolean, default: false },
		isIncomplete: { type: Boolean, default: false },
		status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending", index: true },
		notes: { type: String, default: "" },
		isArchived: { type: Boolean, default: false },
		lastSyncAt: { type: Date },
	},
	{ collection: "reservations", timestamps: true },
);

ReservationSchema.index({ apartmentId: 1, checkIn: 1, checkOut: 1 });

export function getReservationModel(conn: mongoose.Connection) {
	return conn.models.Reservation || conn.model("Reservation", ReservationSchema);
}
