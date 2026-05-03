import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI_PRIVATE!;

if (!MONGODB_URI) {
	throw new Error("Please define MONGODB_URI_PRIVATE in .env.local");
}

// Cache on the global object to survive Next.js hot reloads
interface MongooseCache {
	conn: mongoose.Connection | null;
	promise: Promise<mongoose.Connection> | null;
}

declare global {
	var mongooseCache: MongooseCache | undefined;
}

if (!global.mongooseCache) {
	global.mongooseCache = { conn: null, promise: null };
}

const cache = global.mongooseCache;

export async function connectDB(): Promise<mongoose.Connection> {
	// Already connected — return immediately
	if (cache.conn?.readyState === 1) {
		return cache.conn;
	}

	// Connection in progress — wait for it
	if (!cache.promise) {
		cache.promise = mongoose.createConnection(MONGODB_URI, { bufferCommands: false }).asPromise();
	}

	cache.conn = await cache.promise;
	console.log("MongoDB connected:", cache.conn.name);
	return cache.conn;
}
