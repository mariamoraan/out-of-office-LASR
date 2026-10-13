import type {
  AdminSurveyListFilters,
  AdminSurveyListResult,
} from "@/features/dashboard/domain/admin-survey-filters";
import type {
  AdminSurveyStatsDimension,
  AdminSurveyStatsResult,
} from "@/features/dashboard/domain/admin-survey-stats";
import type { SurveyResponse } from "@/features/survey/domain/survey-response";

export interface AdminSurveyReadRepository {
  list(filters: AdminSurveyListFilters): Promise<AdminSurveyListResult>;
  findById(id: string): Promise<SurveyResponse | null>;
  aggregateStats(
    filters: AdminSurveyListFilters,
    dimension: AdminSurveyStatsDimension,
  ): Promise<AdminSurveyStatsResult>;
}
