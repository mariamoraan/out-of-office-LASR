import type { SurveyResponse } from "@/features/survey/domain/survey-response";
import type { SurveyResponseRepository } from "@/features/survey/domain/ports/survey-response.repository";
import { SurveyDomainError } from "@/features/survey/domain/survey-domain-error";
import { assertCanSubmit } from "@/features/survey/domain/survey-submission.rules";

type Dependencies = {
  surveyResponseRepository: SurveyResponseRepository;
};

export async function submitSurvey(
  sessionToken: string,
  { surveyResponseRepository }: Dependencies,
): Promise<SurveyResponse> {
  const existing =
    await surveyResponseRepository.findBySessionToken(sessionToken);

  if (!existing) {
    throw new SurveyDomainError(
      "SURVEY_NOT_FOUND",
      "Survey draft was not found for this session.",
    );
  }

  assertCanSubmit(existing);

  return surveyResponseRepository.markSubmitted(sessionToken, new Date());
}
