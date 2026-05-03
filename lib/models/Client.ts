import mongoose, { Schema } from "mongoose";

const ClientSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, default: "" },
		phone: { type: String, default: "" },
		address: { type: String, default: "" },
		description: { type: String, default: "" },
		startDate: { type: Date },
	},
	{ collection: "clients", timestamps: true },
);

export function getClientModel(conn: mongoose.Connection) {
	return conn.models.Client || conn.model("Client", ClientSchema);
}
