import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getInvoiceModel } from "@/lib/models";

// GET /api/invoices/check-number?number=FAC-001&excludeId=<id>
export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const number = searchParams.get("number")?.trim();
	const excludeId = searchParams.get("excludeId");

	if (!number) {
		return NextResponse.json({ exists: false });
	}

	try {
		const conn = await connectDB();
		const Invoice = getInvoiceModel(conn);

		const query: Record<string, any> = { number };

		// En mode édition on exclut la facture courante
		if (excludeId) {
			query._id = { $ne: excludeId };
		}

		const existing = await Invoice.findOne(query).lean();

		return NextResponse.json({ exists: !!existing });
	} catch {
		return NextResponse.json({ exists: false }, { status: 500 });
	}
}
