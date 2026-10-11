import type {
  AdminSurveyListFilters,
  AdminSurveyListResult,
} from "@/features/dashboard/domain/admin-survey-filters";
import type { SurveyResponse } from "@/features/survey/domain/survey-response";

export interface AdminSurveyReadRepository {
  list(filters: AdminSurveyListFilters): Promise<AdminSurveyListResult>;
  findById(id: string): Promise<SurveyResponse | null>;
}
