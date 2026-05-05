import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getInvoiceModel } from "@/lib/models";

// ── GET all invoices ──
export async function GET() {
	const conn = await connectDB();
	const Invoice = getInvoiceModel(conn);

	const invoices = await Invoice.find().populate("clientId").sort({ createdAt: -1 });

	return NextResponse.json(invoices);
}

// ── CREATE invoice ──
export async function POST(req: Request) {
	try {
		const conn = await connectDB();
		const Invoice = getInvoiceModel(conn);

		const body = await req.json();

		const total = body.lines?.reduce((sum: number, l: any) => sum + (l.total ?? l.quantity * l.unitPrice), 0) ?? 0;

		const invoice = await Invoice.create({
			...body,
			total,
		});

		const populated = await invoice.populate("clientId");

		return NextResponse.json(populated);
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: "Erreur création facture" }, { status: 500 });
	}
}
