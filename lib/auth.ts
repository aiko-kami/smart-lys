import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function hashPin(pin: string) {
	return bcrypt.hash(pin, 10);
}

export async function verifyPin(pin: string, hash: string) {
	return bcrypt.compare(pin, hash);
}

export async function createToken() {
	return new SignJWT({ auth: true }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("30d").sign(secret);
}

export async function verifyToken(token: string) {
	try {
		const verified = await jwtVerify(token, secret);
		return !!verified.payload;
	} catch {
		return false;
	}
}
