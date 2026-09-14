import mongoose from "mongoose";

declare global {
  var mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = global.mongooseConn ?? { conn: null, promise: null };
global.mongooseConn = cached;

let indexesCleaned = false;

async function cleanupStaleIndexes(conn: typeof mongoose) {
  if (indexesCleaned) return;
  try {
    const db = conn.connection.db;
    if (!db) return;
    const collections = await db.listCollections({ name: "users" }).toArray();
    if (collections.length === 0) return;

    const userCollection = db.collection("users");
    const indexes = await userCollection.indexes();
    const staleIndexNames = ["username_1", "email_1"];

    for (const name of staleIndexNames) {
      if (indexes.some((idx) => idx.name === name)) {
        await userCollection.dropIndex(name).catch(() => {});
      }
    }
    indexesCleaned = true;
  } catch {
    // Non-blocking: fail quietly if permissions or collection state prevent index drop
  }
}

export async function connectDB() {
  if (cached.conn) {
    if (!indexesCleaned) {
      await cleanupStaleIndexes(cached.conn);
    }
    return cached.conn;
  }
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured");
  cached.promise ??= mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  cached.conn = await cached.promise;
  await cleanupStaleIndexes(cached.conn);
  return cached.conn;
}
