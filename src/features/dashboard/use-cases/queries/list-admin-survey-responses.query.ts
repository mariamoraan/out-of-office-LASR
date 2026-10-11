import type {
  AdminSurveyListFilters,
  AdminSurveyListResult,
} from "@/features/dashboard/domain/admin-survey-filters";
import type { AdminSurveyReadRepository } from "@/features/dashboard/domain/ports/admin-survey-read.repository";

type ListAdminSurveyResponsesDeps = {
  adminSurveyReadRepository: AdminSurveyReadRepository;
};

export async function listAdminSurveyResponses(
  filters: AdminSurveyListFilters,
  deps: ListAdminSurveyResponsesDeps,
): Promise<AdminSurveyListResult> {
  return deps.adminSurveyReadRepository.list(filters);
}
