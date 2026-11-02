import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as { _hopehiveMongo?: MongoClient };

function getClient(): MongoClient {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Copy .env.example to .env.local and fill it in.");
  }
  // Reuse one client across hot reloads and warm serverless invocations instead of opening a new pool each time.
  globalForMongo._hopehiveMongo ??= new MongoClient(uri);
  return globalForMongo._hopehiveMongo;
}

export const mongoClient = getClient();
export const authDb = mongoClient.db();
