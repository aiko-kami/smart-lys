import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getInvoiceModel } from "@/lib/models";

// ── UPDATE ──
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await context.params;

		const conn = await connectDB();
		const Invoice = getInvoiceModel(conn);

		const body = await req.json();

		const updated = await Invoice.findByIdAndUpdate(id, body, {
			returnDocument: "after",
		}).populate("clientId");

		if (!updated) {
			return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
		}

		return NextResponse.json(updated);
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}

// ── DELETE ──
export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await context.params;

		const conn = await connectDB();
		const Invoice = getInvoiceModel(conn);

		const deleted = await Invoice.findByIdAndDelete(id);

		if (!deleted) {
			return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
		}

		return NextResponse.json({ success: true });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
	}
}
