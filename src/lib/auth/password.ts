import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const DEFAULT_N = 16_384;
const DEFAULT_R = 8;
const DEFAULT_P = 1;
const MAX_PASSWORD_LENGTH = 1024;

type ScryptOptions = {
  N: number;
  r: number;
  p: number;
  maxmem: number;
};

function deriveKey(password: string, salt: Buffer, keyLength: number, options: ScryptOptions) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, derivedKey) => {
      if (error) {
        reject(error);
      } else {
        resolve(derivedKey);
      }
    });
  });
}

type ScryptParams = {
  n: number;
  r: number;
  p: number;
  salt: Buffer;
  hash: Buffer;
};

function parseHash(encoded: string): ScryptParams | null {
  const [algorithm, nValue, rValue, pValue, saltValue, hashValue] = encoded.split("$");
  const n = Number(nValue);
  const r = Number(rValue);
  const p = Number(pValue);
  if (algorithm !== "scrypt" || !Number.isSafeInteger(n) || !Number.isSafeInteger(r) || !Number.isSafeInteger(p)) {
    return null;
  }
  if (n < 2 || (n & (n - 1)) !== 0 || r < 1 || p < 1 || !saltValue || !hashValue) return null;

  try {
    const salt = Buffer.from(saltValue, "base64url");
    const hash = Buffer.from(hashValue, "base64url");
    if (salt.length < 16 || hash.length !== KEY_LENGTH) return null;
    return { n, r, p, salt, hash };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  if (!password || password.length > MAX_PASSWORD_LENGTH) throw new Error("Password tidak valid.");
  const salt = randomBytes(16);
  const hash = await deriveKey(password, salt, KEY_LENGTH, {
    N: DEFAULT_N,
    r: DEFAULT_R,
    p: DEFAULT_P,
    maxmem: 32 * 1024 * 1024,
  });
  return `scrypt$${DEFAULT_N}$${DEFAULT_R}$${DEFAULT_P}$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export async function verifyPassword(password: string, encoded: string) {
  if (!password || password.length > MAX_PASSWORD_LENGTH) return false;
  const params = parseHash(encoded);
  if (!params) return false;

  try {
    const hash = await deriveKey(password, params.salt, params.hash.length, {
      N: params.n,
      r: params.r,
      p: params.p,
      maxmem: Math.max(128 * params.n * params.r + 1024, 32 * 1024 * 1024),
    });
    return timingSafeEqual(hash, params.hash);
  } catch {
    return false;
  }
}
