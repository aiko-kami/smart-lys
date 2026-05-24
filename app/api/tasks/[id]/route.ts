import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { registerModels, getTaskModel } from "@/lib/models";

// ─────────────────────────────────────────────
// UPDATE TASK
// ─────────────────────────────────────────────

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	try {
		const body = await req.json();

		const conn = await connectDB();
		registerModels(conn);

		const Task = getTaskModel(conn);

		const before = await Task.findById(id);

		if (!before) {
			return NextResponse.json({ error: "Task non trouvée (avant update)" }, { status: 404 });
		}

		const update: any = { ...body };
		const unset: Record<string, 1> = {};

		// clientId
		if (!update.clientId) {
			unset.clientId = 1;
			delete update.clientId;
		}

		// apartmentId
		if (!update.apartmentId) {
			unset.apartmentId = 1;
			delete update.apartmentId;
		}

		// reservationId
		if (!update.reservationId) {
			unset.reservationId = 1;
			delete update.reservationId;
		}

		// si on a des champs à unset → on les ajoute
		if (Object.keys(unset).length > 0) {
			update.$unset = unset;
		}

		const updated = await Task.findByIdAndUpdate(id, update, {
			new: true,
			runValidators: true,
		})
			.populate("apartmentId", "name")
			.populate("clientId", "name")
			.populate("reservationId", "guestName checkIn checkOut")
			.lean();

		return NextResponse.json(updated);
	} catch (err) {
		console.error("TASK_UPDATE_ERROR", err);

		return NextResponse.json(
			{
				error: "Erreur update task",
				details: err instanceof Error ? err.message : err,
			},
			{ status: 500 },
		);
	}
}

// ─────────────────────────────────────────────
// DELETE TASK
// ─────────────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		const conn = await connectDB();
		registerModels(conn);

		const Task = getTaskModel(conn);

		const deleted = await Task.findByIdAndDelete(id);

		if (!deleted) {
			return NextResponse.json({ error: "Task non trouvée" }, { status: 404 });
		}

		return NextResponse.json({ ok: true });
	} catch (err) {
		console.error("TASK_DELETE_ERROR", err);

		return NextResponse.json({ error: "Erreur delete task" }, { status: 500 });
	}
}
