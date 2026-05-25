import mongoose, { Schema } from "mongoose";

const InvoiceLineSchema = new Schema(
	{
		description: { type: String, required: true },
		quantity: { type: Number, required: true },
		unitPrice: { type: Number, required: true },
		total: { type: Number, required: true },
	},
	{ _id: false },
);

const InvoiceSchema = new Schema(
	{
		number: { type: String, required: [true, "Le numéro de facture est requis"], unique: true },
		clientId: {
			type: Schema.Types.ObjectId,
			ref: "Client",
			required: [true, "Le client est requis"],
		},
		date: { type: Date, required: [true, "La date est requise"] },
		dueDate: { type: Date },
		lines: [InvoiceLineSchema],
		total: { type: Number, required: [true, "Le total est requis"] },
		status: {
			type: String,
			enum: ["draft", "sent", "paid", "late"],
			default: "draft",
		},
	},
	{ timestamps: true },
);

export function getInvoiceModel(conn: mongoose.Connection) {
	return conn.models.Invoice || conn.model("Invoice", InvoiceSchema);
}
