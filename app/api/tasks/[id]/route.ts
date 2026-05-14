import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getTaskModel } from "@/lib/models";

// ─────────────────────────────────────────────
// UPDATE TASK
// ─────────────────────────────────────────────

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const body = await req.json();
	const conn = await connectDB();
	const Task = getTaskModel(conn);

	console.log("UPDATE TASK ID:", id);

	const before = await Task.findById(id);

	if (!before) {
		return NextResponse.json({ error: "Task non trouvée (avant update)" }, { status: 404 });
	}

	const updated = await Task.findByIdAndUpdate(id, body, {
		new: true,
	})
		.populate("apartmentId", "name")
		.populate("clientId", "name")
		.lean();

	return NextResponse.json(updated);
}

// ─────────────────────────────────────────────
// DELETE TASK
// ─────────────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const conn = await connectDB();

		const Task = getTaskModel(conn);

		const deleted = await Task.findByIdAndDelete(params.id);

		if (!deleted) {
			return NextResponse.json({ error: "Task non trouvée" }, { status: 404 });
		}

		return NextResponse.json({ ok: true });
	} catch (err) {
		console.error("TASK_DELETE_ERROR", err);

		return NextResponse.json({ error: "Erreur delete task" }, { status: 500 });
	}
}
