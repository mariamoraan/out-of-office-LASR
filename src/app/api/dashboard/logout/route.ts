import { NextResponse } from "next/server";

import { clearAdminSessionCookie } from "@/features/dashboard/infrastructure/admin-session";
import { toAdminErrorResponse } from "@/features/dashboard/infrastructure/http/admin-http-error";

export async function POST() {
  try {
    await clearAdminSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}
