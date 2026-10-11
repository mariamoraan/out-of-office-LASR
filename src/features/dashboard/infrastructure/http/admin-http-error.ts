import { NextResponse } from "next/server";

import { AdminAuthError } from "@/features/dashboard/domain/admin-auth-error";
import { AdminDashboardError } from "@/features/dashboard/domain/admin-dashboard-error";

export function toAdminErrorResponse(error: unknown) {
  if (error instanceof AdminAuthError) {
    const status =
      error.code === "ADMIN_AUTH_NOT_CONFIGURED"
        ? 503
        : error.code === "INVALID_CREDENTIALS" || error.code === "UNAUTHORIZED"
          ? 401
          : 400;

    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status },
    );
  }

  if (error instanceof AdminDashboardError) {
    const status = error.code === "RESPONSE_NOT_FOUND" ? 404 : 400;

    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status },
    );
  }

  console.error(error);
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: "Unexpected error." } },
    { status: 500 },
  );
}
