import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { registerModels, getTaskModel, getApartmentModel, getClientModel } from "@/lib/models";

// ─────────────────────────────────────────────
// GET all tasks
// ─────────────────────────────────────────────

export async function GET() {
	const conn = await connectDB();
	registerModels(conn);
	const Task = getTaskModel(conn);

	// optionnel: si tu veux populate relations
	getApartmentModel(conn);
	getClientModel(conn);

	const tasks = await Task.find().populate("apartmentId", "name").populate("clientId", "name").sort({ dueDate: 1 }).lean();

	return NextResponse.json(JSON.parse(JSON.stringify(tasks)));
}

// ─────────────────────────────────────────────
// CREATE task
// ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const conn = await connectDB();
		registerModels(conn);

		const Task = getTaskModel(conn);

		const task = await Task.create(body);

		const populated = await task.populate([
			{ path: "apartmentId", select: "name" },
			{ path: "clientId", select: "name" },
		]);

		return NextResponse.json(JSON.parse(JSON.stringify(populated)), { status: 201 });
	} catch (err) {
		console.error("TASK_CREATE_ERROR", err);

		return NextResponse.json({ error: "Error creating task" }, { status: 500 });
	}
}
