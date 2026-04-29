import mongoose, { Schema, model, models } from "mongoose";

const ClientSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: String, default: "" },
		address: { type: String, default: "" },
		siret: { type: String, default: "" },
	},
	{ collection: "clients", timestamps: true },
);

export const ClientModel = models.Client || model("Client", ClientSchema);
