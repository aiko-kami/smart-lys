import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getPaymentModel } from "@/lib/models";

export async function GET() {
	try {
		const conn = await connectDB();
		const Payment = getPaymentModel(conn);

		const payment = await Payment.findOne();

		return NextResponse.json(payment);
	} catch (err) {
		console.error("PAYMENT_GET_ERROR", err);
		return NextResponse.json({ error: "Error fetching payment info" }, { status: 500 });
	}
}

export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();

		const conn = await connectDB();
		const Payment = getPaymentModel(conn);

		const existing = await Payment.findOne();

		let result;

		if (!existing) {
			result = await Payment.create(body);
		} else {
			result = await Payment.findByIdAndUpdate(existing._id, body, {
				new: true,
			});
		}

		return NextResponse.json(result);
	} catch (err) {
		console.error("PAYMENT_UPDATE_ERROR", err);
		return NextResponse.json({ error: "Error updating payment info" }, { status: 500 });
	}
}
