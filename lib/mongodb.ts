import mongoose from "mongoose";

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
	const MONGODB_URI = process.env.MONGODB_URI_PRIVATE;

	if (!MONGODB_URI) {
		throw new Error("Missing MONGODB_URI_PRIVATE");
	}

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
