import { createHmac, timingSafeEqual } from "node:crypto";

export type AdminSessionPayload = {
  username: string;
  exp: number;
};

function signBody(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

/** Pure helper — callers supply request-time `nowSeconds` (no Date.now here). */
export function createAdminSessionExpiry(
  maxAgeSeconds: number,
  nowSeconds: number,
): number {
  return nowSeconds + maxAgeSeconds;
}

export function signAdminSessionToken(
  payload: AdminSessionPayload,
  secret: string,
): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  return `${body}.${signBody(body, secret)}`;
}

export function verifyAdminSessionToken(
  token: string,
  secret: string,
  nowSeconds: number,
): AdminSessionPayload | null {
  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex <= 0 || separatorIndex === token.length - 1) {
    return null;
  }

  const body = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  const expected = signBody(body, secret);

  if (!safeEqual(signature, expected)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as Partial<AdminSessionPayload>;

    if (
      typeof parsed.username !== "string" ||
      parsed.username.length === 0 ||
      typeof parsed.exp !== "number" ||
      !Number.isFinite(parsed.exp) ||
      parsed.exp < nowSeconds
    ) {
      return null;
    }

    return { username: parsed.username, exp: parsed.exp };
  } catch {
    return null;
  }
}
