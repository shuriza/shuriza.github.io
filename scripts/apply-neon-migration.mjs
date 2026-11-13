import { readFile } from "node:fs/promises";
import postgres from "postgres";

const targetUrl = process.env.DATABASE_URL;
if (!targetUrl) throw new Error("Set DATABASE_URL sebelum menjalankan migration Neon.");

const migrationPath = process.argv[2] ?? "../db/migrations/20261112_content_model.sql";
const migration = await readFile(new URL(migrationPath, import.meta.url), "utf8");
const database = postgres(targetUrl, { max: 1, prepare: false, ssl: "require" });

try {
  await database.unsafe(migration);
  console.log(`Migration berhasil dijalankan: ${migrationPath}`);
} finally {
  await database.end();
}
