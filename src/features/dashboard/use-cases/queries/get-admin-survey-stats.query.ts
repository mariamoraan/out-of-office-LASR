import type { AdminSurveyListFilters } from "@/features/dashboard/domain/admin-survey-filters";
import type {
  AdminSurveyStatsDimension,
  AdminSurveyStatsResult,
} from "@/features/dashboard/domain/admin-survey-stats";
import type { AdminSurveyReadRepository } from "@/features/dashboard/domain/ports/admin-survey-read.repository";

type GetAdminSurveyStatsDeps = {
  adminSurveyReadRepository: AdminSurveyReadRepository;
};

export async function getAdminSurveyStats(
  filters: AdminSurveyListFilters,
  dimension: AdminSurveyStatsDimension,
  deps: GetAdminSurveyStatsDeps,
): Promise<AdminSurveyStatsResult> {
  return deps.adminSurveyReadRepository.aggregateStats(filters, dimension);
}
