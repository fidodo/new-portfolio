import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET environment variable is not set");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

export function createSessionToken(): string {
  const expiresAt = (Date.now() + SESSION_TTL_MS).toString();
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;

  let expectedSignature: string;
  try {
    expectedSignature = sign(expiresAt);
  } catch (error) {
    // Misconfigured deployment (missing ADMIN_SESSION_SECRET) should fail
    // closed as "not an admin", not crash every route that checks this.
    console.error("Admin session verification unavailable:", error);
    return false;
  }

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return false;

  return Date.now() < Number(expiresAt);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  // Hash both sides to a fixed length before comparing so a mismatched
  // input length can't short-circuit before timingSafeEqual runs — that
  // early return would otherwise leak the expected password's length.
  const passwordHash = createHash("sha256").update(password).digest();
  const expectedHash = createHash("sha256").update(expected).digest();

  return timingSafeEqual(passwordHash, expectedHash);
}

/** Reads the admin session cookie from the current request context (route handlers, server components). */
export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** Guard for route handlers: returns a 401 response if there's no valid admin session, otherwise null. */
export async function requireAdmin(): Promise<NextResponse | null> {
  return (await isAdminSession()) ? null : unauthorizedResponse();
}
