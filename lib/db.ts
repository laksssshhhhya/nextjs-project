import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!

if(!MONGODB_URI){
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }
    
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
        }

        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log("MongoDB connected successfully");
                return mongoose;
            })
            .catch((err) => {
                console.error("MongoDB connection error:", err);
                throw err;
            });
    }

    try{
        cached.conn = await cached.promise;
    }
    catch(err){
        cached.promise = null;
        throw err;
    }
    
    return cached.conn;
}
