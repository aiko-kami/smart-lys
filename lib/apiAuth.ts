import { cookies } from "next/headers";

import { verifyToken } from "@/lib/auth";

export async function requireApiAuth() {
	const cookieStore = await cookies();

	const token = cookieStore.get("smartlys_session")?.value;

	if (!token) {
		return false;
	}

	return verifyToken(token);
}
