import { AdminDashboardError } from "@/features/dashboard/domain/admin-dashboard-error";
import type { AdminSurveyReadRepository } from "@/features/dashboard/domain/ports/admin-survey-read.repository";
import type { SurveyResponse } from "@/features/survey/domain/survey-response";

type GetAdminSurveyResponseDeps = {
  adminSurveyReadRepository: AdminSurveyReadRepository;
};

export async function getAdminSurveyResponse(
  id: string,
  deps: GetAdminSurveyResponseDeps,
): Promise<SurveyResponse> {
  const survey = await deps.adminSurveyReadRepository.findById(id);

  if (!survey) {
    throw new AdminDashboardError(
      "RESPONSE_NOT_FOUND",
      "Survey response was not found.",
    );
  }

  return survey;
}
