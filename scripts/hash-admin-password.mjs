import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const password = process.argv[2] ?? (await createInterface({ input, output }).question("Admin password: "));
if (!password || password.length > 1024) {
  throw new Error("Password wajib diisi dan maksimal 1024 karakter.");
}

const n = 16_384;
const r = 8;
const p = 1;
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64, {
  N: n,
  r,
  p,
  maxmem: 32 * 1024 * 1024,
});

console.log(`scrypt$${n}$${r}$${p}$${salt.toString("base64url")}$${hash.toString("base64url")}`);
