import mongoose, { Schema, model, models } from "mongoose";

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
		number: { type: String, required: true, unique: true },
		clientId: {
			type: Schema.Types.ObjectId,
			ref: "Client",
			required: true,
		},
		date: { type: Date, required: true },
		dueDate: { type: Date },
		lines: [InvoiceLineSchema],
		total: { type: Number, required: true },
		status: {
			type: String,
			enum: ["draft", "sent", "paid"],
			default: "draft",
		},
	},
	{ timestamps: true },
);

export function getInvoiceModel(conn: mongoose.Connection) {
	return conn.models.Invoice || conn.model("Invoice", InvoiceSchema);
}
