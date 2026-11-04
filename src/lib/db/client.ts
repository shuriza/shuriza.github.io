import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { databaseSchema } from "./schema";

export type Database = NeonHttpDatabase<typeof databaseSchema>;

function createDatabase(connectionString: string): Database {
  return drizzle({ client: neon(connectionString), schema: databaseSchema });
}

let cachedConnectionString: string | null = null;
let cachedDatabase: Database | null = null;

export function getDatabase(): Database | null {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) return null;

  if (!cachedDatabase || cachedConnectionString !== connectionString) {
    cachedDatabase = createDatabase(connectionString);
    cachedConnectionString = connectionString;
  }

  return cachedDatabase;
}

export function requireDatabase(): Database {
  const database = getDatabase();
  if (!database) {
    throw new Error("DATABASE_URL belum dikonfigurasi.");
  }
  return database;
}
