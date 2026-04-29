import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI_PRIVATE!;

if (!MONGODB_URI) {
	throw new Error("Please define MONGODB_URI_PRIVATE in .env.local");
}

declare global {
	var mongooseConnection: mongoose.Connection | undefined;
}

export async function connectDB() {
	if (global.mongooseConnection?.readyState === 1) {
		console.log("Reusing DB connection:", global.mongooseConnection.name);

		return global.mongooseConnection;
	}

	const connection = mongoose.createConnection(MONGODB_URI, {
		bufferCommands: false,
	});

	await connection.asPromise();

	global.mongooseConnection = connection;

	console.log("MongoDB connected successfully");
	console.log("Connected DB:", connection.name);

	return connection;
}
