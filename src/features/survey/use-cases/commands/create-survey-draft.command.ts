import type { SurveyResponse } from "@/features/survey/domain/survey-response";
import type { SurveyResponseRepository } from "@/features/survey/domain/ports/survey-response.repository";

type Dependencies = {
  surveyResponseRepository: SurveyResponseRepository;
};

export async function createSurveyDraft(
  sessionToken: string,
  { surveyResponseRepository }: Dependencies,
): Promise<SurveyResponse> {
  const existing =
    await surveyResponseRepository.findBySessionToken(sessionToken);

  if (existing) {
    return existing;
  }

  return surveyResponseRepository.createDraft(sessionToken);
}
