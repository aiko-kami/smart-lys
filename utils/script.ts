import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { connectDB } from "@/lib/mongodb";
import { getSettingsModel } from "@/lib/models/Settings";

import { hashPin } from "@/lib/auth";

async function main() {
	console.log("🔥 SCRIPT LOADED");
	const conn = await connectDB();

	const Settings = getSettingsModel(conn);

	const hash = await hashPin("1234");

	await Settings.findOneAndUpdate(
		{},
		{
			auth: {
				pinHash: hash,
			},
		},
		{
			upsert: true,
			new: true,
		},
	);

	console.log("PIN créé");

	process.exit(0);
}

main();
