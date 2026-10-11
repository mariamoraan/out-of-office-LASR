import { NextResponse } from "next/server";

import { toAdminSurveyResponseDto } from "@/features/dashboard/infrastructure/admin-survey-response.dto";
import { dashboardDependencies } from "@/features/dashboard/infrastructure/dashboard-dependencies";
import { requireAdminSession } from "@/features/dashboard/infrastructure/admin-session";
import { toAdminErrorResponse } from "@/features/dashboard/infrastructure/http/admin-http-error";
import { getAdminSurveyResponse } from "@/features/dashboard/use-cases/queries/get-admin-survey-response.query";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdminSession();

    const { id } = await context.params;
    const survey = await getAdminSurveyResponse(id, dashboardDependencies);

    return NextResponse.json({
      response: toAdminSurveyResponseDto(survey),
    });
  } catch (error) {
    return toAdminErrorResponse(error);
  }
}
