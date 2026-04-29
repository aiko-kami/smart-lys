import mongoose, { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
	{
		title: { type: String, required: true },
		type: {
			type: String,
			enum: ["cleaning", "checkin", "checkout", "maintenance", "other"],
			default: "other",
		},
		apartmentId: {
			type: Schema.Types.ObjectId,
			ref: "Apartment",
		},
		dueDate: { type: Date, required: true },
		status: {
			type: String,
			enum: ["pending", "in_progress", "done"],
			default: "pending",
		},
	},
	{ timestamps: true },
);

export const TaskModel = models.Task || model("Task", TaskSchema);
