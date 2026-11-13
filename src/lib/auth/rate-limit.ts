import { headers } from "next/headers";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type LoginAttempt = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, LoginAttempt>();

function prune(now: number) {
  for (const [key, attempt] of attempts) {
    if (attempt.resetAt <= now) attempts.delete(key);
  }
}

async function attemptKey(email: string) {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || requestHeaders.get("x-real-ip")?.trim() || "unknown";
  return `${ip}:${email}`;
}

/** Best-effort protection for serverless instances; production WAF remains the durable layer. */
export async function isLoginRateLimited(email: string) {
  const now = Date.now();
  prune(now);
  const attempt = attempts.get(await attemptKey(email));
  return Boolean(attempt && attempt.count >= MAX_ATTEMPTS && attempt.resetAt > now);
}

export async function recordFailedLogin(email: string) {
  const now = Date.now();
  prune(now);
  const key = await attemptKey(email);
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  current.count += 1;
}

export async function clearLoginFailures(email: string) {
  attempts.delete(await attemptKey(email));
}
