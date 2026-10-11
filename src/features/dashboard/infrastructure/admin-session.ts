import { cookies } from "next/headers";
import { connection } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from "@/core/constants/app.constants";
import { AdminAuthError } from "@/features/dashboard/domain/admin-auth-error";
import { readAdminSessionSecret } from "@/features/dashboard/infrastructure/admin-env";
import {
  type AdminSessionPayload,
  verifyAdminSessionToken,
} from "@/features/dashboard/infrastructure/admin-session-token";

export async function setAdminSessionCookie(
  token: string,
  maxAgeSeconds: number = ADMIN_SESSION_MAX_AGE_SECONDS,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

async function requestUnixSeconds(): Promise<number> {
  // Cache Components: Date.now() is only allowed after opting into the request.
  await connection();
  return Math.floor(Date.now() / 1000);
}

export async function readAdminSession(): Promise<AdminSessionPayload | null> {
  const nowSeconds = await requestUnixSeconds();
  const cookieStore = await cookies();
  const secret = readAdminSessionSecret();
  if (!secret) {
    return null;
  }

  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  return verifyAdminSessionToken(token, secret, nowSeconds);
}

export async function requireAdminSession(): Promise<AdminSessionPayload> {
  const nowSeconds = await requestUnixSeconds();
  const cookieStore = await cookies();
  const secret = readAdminSessionSecret();
  if (!secret) {
    throw new AdminAuthError(
      "ADMIN_AUTH_NOT_CONFIGURED",
      "Admin authentication is not configured.",
    );
  }

  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    throw new AdminAuthError("UNAUTHORIZED", "Admin session is required.");
  }

  const payload = verifyAdminSessionToken(token, secret, nowSeconds);
  if (!payload) {
    throw new AdminAuthError("UNAUTHORIZED", "Admin session is invalid.");
  }

  return payload;
}
