import mongoose, { Schema } from "mongoose";

const PaymentSchema = new Schema(
	{
		name: { type: String, required: true },
		bank: { type: String, default: "" },
		iban: { type: String, default: "" },
		bic: { type: String, default: "" },
		description: { type: String, default: "" },
		paymentTerms: { type: String, default: "" },
	},
	{ collection: "payments", timestamps: true },
);

export function getPaymentModel(conn: mongoose.Connection) {
	return conn.models.Payment || conn.model("Payment", PaymentSchema);
}
