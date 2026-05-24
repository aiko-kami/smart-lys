import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, default: "" },
		type: { type: String, enum: ["cleaning", "checkin", "checkout", "maintenance", "inspection", "chloe", "amy", "adrian", "other"], default: "other" },
		apartmentId: { type: Schema.Types.ObjectId, ref: "Apartment", required: false },
		clientId: { type: Schema.Types.ObjectId, ref: "Client", required: false },
		reservationId: { type: Schema.Types.ObjectId, ref: "Reservation", required: false },
		dueDate: { type: Date, required: true },
		startDate: { type: Date },
		duration: { type: Number },
		status: { type: String, enum: ["pending", "in progress", "done", "cancelled", "N/A"], default: "pending" },
		priority: { type: String, enum: ["low", "medium", "high", "N/A"], default: "N/A" },
		notes: { type: String, default: "" },
	},
	{
		collection: "tasks",
		timestamps: true,
	},
);

export function getTaskModel(conn: mongoose.Connection) {
	return conn.models.Task || conn.model("Task", TaskSchema);
}
