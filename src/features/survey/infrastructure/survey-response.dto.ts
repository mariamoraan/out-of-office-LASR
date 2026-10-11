import type { SurveyResponse } from "@/features/survey/domain/survey-response";

export type SurveyResponseDto = Omit<
  SurveyResponse,
  "createdAt" | "updatedAt" | "submittedAt"
> & {
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
};

export function toSurveyResponseDto(
  survey: SurveyResponse,
): SurveyResponseDto {
  return {
    ...survey,
    createdAt: survey.createdAt.toISOString(),
    updatedAt: survey.updatedAt.toISOString(),
    submittedAt: survey.submittedAt ? survey.submittedAt.toISOString() : null,
  };
}
