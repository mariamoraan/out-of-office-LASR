import { timingSafeEqual } from "node:crypto";

/** Constant-time string compare; unequal lengths always return false. */
export function safeStringEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);

  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }

  return timingSafeEqual(a, b);
}
