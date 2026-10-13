import {
  ADMIN_SURVEY_STATS_DEFAULT_DIMENSION,
  ADMIN_SURVEY_STATS_DIMENSIONS,
  type AdminSurveyStatsDimension,
} from "@/features/dashboard/domain/admin-survey-stats";

export function parseAdminSurveyStatsDimension(
  params: URLSearchParams,
): AdminSurveyStatsDimension {
  const raw = params.get("dimension")?.trim();

  if (
    raw &&
    (ADMIN_SURVEY_STATS_DIMENSIONS as readonly string[]).includes(raw)
  ) {
    return raw as AdminSurveyStatsDimension;
  }

  return ADMIN_SURVEY_STATS_DEFAULT_DIMENSION;
}
