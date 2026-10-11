import type { SurveyResponseRepository } from "@/features/survey/domain/ports/survey-response.repository";

type Dependencies = {
  surveyResponseRepository: SurveyResponseRepository;
};

export async function hasSubmittedSurveyForSession(
  sessionToken: string | undefined,
  { surveyResponseRepository }: Dependencies,
): Promise<boolean> {
  if (!sessionToken) {
    return false;
  }

  const survey =
    await surveyResponseRepository.findBySessionToken(sessionToken);

  return survey?.status === "submitted";
}
