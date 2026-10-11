import type {
  SurveyDraftPatch,
  SurveyResponse,
} from "@/features/survey/domain/survey-response";

export interface SurveyResponseRepository {
  createDraft(sessionToken: string): Promise<SurveyResponse>;
  findBySessionToken(sessionToken: string): Promise<SurveyResponse | null>;
  updateDraft(
    sessionToken: string,
    patch: SurveyDraftPatch,
  ): Promise<SurveyResponse>;
  markSubmitted(sessionToken: string, submittedAt: Date): Promise<SurveyResponse>;
}
