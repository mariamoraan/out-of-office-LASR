import type { SurveyResponse } from "@/features/survey/domain/survey-response";
import type { SurveyResponseRepository } from "@/features/survey/domain/ports/survey-response.repository";

type Dependencies = {
  surveyResponseRepository: SurveyResponseRepository;
};

export async function getSurveyDraftBySession(
  sessionToken: string,
  { surveyResponseRepository }: Dependencies,
): Promise<SurveyResponse | null> {
  return surveyResponseRepository.findBySessionToken(sessionToken);
}
