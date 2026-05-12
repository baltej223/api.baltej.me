"use server";
import mongoose from "mongoose";
import userSchema from "../models/User.model.ts";
import apiDbSchema from "../models/Api.model.ts"


export let User: any =
  mongoose.models.userData || mongoose.model("User", userSchema);

export let APIModel: any = mongoose.models.ApiModel || mongoose.model("API", apiDbSchema);

interface CachedConnection {
  connection: typeof mongoose | null;
  promise: ReturnType<typeof mongoose.connect> | null;
}

const globalMongoose = global as typeof globalThis & {
  mongoose?: CachedConnection;
};

let cached: CachedConnection = globalMongoose.mongoose ?? { connection: null, promise: null };
globalMongoose.mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not set");
    }
    const promise = mongoose.connect(mongoUri);
    console.log("Connecting to ", mongoUri);
    cached.promise = promise;
  }

  cached.connection = await cached.promise;
  return cached.connection;
}
