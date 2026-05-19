import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
	const pathname = req.nextUrl.pathname;

	const publicRoutes = ["/login", "/api/auth/login", "/_next", "/favicon.ico"];

	const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

	if (isPublic) {
		return NextResponse.next();
	}

	const token = req.cookies.get("smartlys_session")?.value;

	if (!token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	const valid = await verifyToken(token);

	if (!valid) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/:path*"],
};
