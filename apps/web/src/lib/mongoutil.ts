import mongoose from "mongoose";

// Checking if the env var is set
if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}


let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {

    // if it has already been connected in the past, use the cached version
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(process.env.MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }

    // Await
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }


    return cached.conn;

}


export default connectToDatabase;