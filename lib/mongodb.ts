import mongoose, { type ConnectOptions, type Mongoose } from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache:
    | { conn: Mongoose | null; promise: Promise<Mongoose> | null }
    | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");

let cached = globalThis._mongooseCache ?? { conn: null, promise: null };

export default async function connect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts: ConnectOptions = { dbName: "persian_signup" };
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }
  cached.conn = await cached.promise;
  globalThis._mongooseCache = cached;
  return cached.conn;
}
