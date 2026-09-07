// In-memory sliding-window rate limiter.
//
// Caveat: this state lives in the process, so on a serverless platform
// (e.g. Vercel) it only throttles requests that land on the same warm
// function instance — it will not stop a distributed brute force across
// many cold starts. It's a pragmatic first line of defense against casual
// automated guessing, not a substitute for a shared store (Redis, etc.) if
// this endpoint ever needs to be bulletproof.
const attempts = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 10;

export function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { allowed: true };
}
