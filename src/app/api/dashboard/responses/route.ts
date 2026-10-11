import { NextResponse } from "next/server";

import { toAdminSurveyResponseDto } from "@/features/dashboard/infrastructure/admin-survey-response.dto";
import { dashboardDependencies } from "@/features/dashboard/infrastructure/dashboard-dependencies";
import { requireAdminSession } from "@/features/dashboard/infrastructure/admin-session";
import { toAdminErrorResponse } from "@/features/dashboard/infrastructure/http/admin-http-error";
import { parseAdminSurveyListFilters } from "@/features/dashboard/infrastructure/parse-admin-survey-list-filters";
import { deleteAdminSurveyResponses } from "@/features/dashboard/use-cases/commands/delete-admin-survey-responses.command";
import { listAdminSurveyResponses } from "@/features/dashboard/use-cases/queries/list-admin-survey-responses.query";

export async function GET(request: Request) {
  try {
    await requireAdminSession();

    const filters = parseAdminSurveyListFilters(
      new URL(request.url).searchParams,
    );
    const result = await listAdminSurveyResponses(
      filters,
      dashboardDependencies,
    );

    return NextResponse.json({
      items: result.items.map(toAdminSurveyResponseDto),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    });
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}

function parseDeleteIds(body: unknown): string[] {
  if (!body || typeof body !== "object" || !("ids" in body)) {
    return [];
  }

  const { ids } = body as { ids: unknown };

  if (!Array.isArray(ids)) {
    return [];
  }

  return ids.filter((id): id is string => typeof id === "string");
}

export async function DELETE(request: Request) {
  try {
    await requireAdminSession();

    const body = (await request.json()) as unknown;
    const result = await deleteAdminSurveyResponses(
      parseDeleteIds(body),
      dashboardDependencies,
    );

    return NextResponse.json(result);
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}
