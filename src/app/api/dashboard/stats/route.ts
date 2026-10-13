import { NextResponse } from "next/server";

import { requireAdminSession } from "@/features/dashboard/infrastructure/admin-session";
import { dashboardDependencies } from "@/features/dashboard/infrastructure/dashboard-dependencies";
import { toAdminErrorResponse } from "@/features/dashboard/infrastructure/http/admin-http-error";
import { parseAdminSurveyListFilters } from "@/features/dashboard/infrastructure/parse-admin-survey-list-filters";
import { parseAdminSurveyStatsDimension } from "@/features/dashboard/infrastructure/parse-admin-survey-stats-dimension";
import { getAdminSurveyStats } from "@/features/dashboard/use-cases/queries/get-admin-survey-stats.query";

export async function GET(request: Request) {
  try {
    await requireAdminSession();

    const params = new URL(request.url).searchParams;
    const filters = parseAdminSurveyListFilters(params);
    const dimension = parseAdminSurveyStatsDimension(params);
    const result = await getAdminSurveyStats(
      filters,
      dimension,
      dashboardDependencies,
    );

    return NextResponse.json(result);
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}
