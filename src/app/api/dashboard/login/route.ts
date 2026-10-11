import { NextResponse } from "next/server";

import { toAdminErrorResponse } from "@/features/dashboard/infrastructure/http/admin-http-error";
import { setAdminSessionCookie } from "@/features/dashboard/infrastructure/admin-session";
import { loginAdmin } from "@/features/dashboard/use-cases/commands/login-admin.command";

type LoginBody = {
  username?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const username =
      typeof body.username === "string" ? body.username : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    const session = loginAdmin({ username, password });
    await setAdminSessionCookie(session.token, session.maxAgeSeconds);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}
