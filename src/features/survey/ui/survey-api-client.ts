import type { SurveyDraftPatch } from "@/features/survey/domain/survey-response";
import type { SurveyResponseDto } from "@/features/survey/infrastructure/survey-response.dto";

type SurveyApiResponse = {
  survey: SurveyResponseDto;
};

type SurveyApiError = {
  error: {
    code: string;
    message: string;
  };
};

async function parseSurveyResponse(
  response: Response,
): Promise<SurveyResponseDto> {
  const payload = (await response.json()) as SurveyApiResponse | SurveyApiError;

  if (!response.ok) {
    const message =
      "error" in payload ? payload.error.message : "Request failed";
    throw new Error(message);
  }

  return (payload as SurveyApiResponse).survey;
}

export async function fetchSurveyDraft(): Promise<SurveyResponseDto> {
  const response = await fetch("/api/survey", {
    method: "GET",
    cache: "no-store",
  });

  return parseSurveyResponse(response);
}

export async function patchSurveyDraft(
  patch: SurveyDraftPatch,
): Promise<SurveyResponseDto> {
  const response = await fetch("/api/survey", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  });

  return parseSurveyResponse(response);
}

export async function submitSurveyDraft(): Promise<SurveyResponseDto> {
  const response = await fetch("/api/survey/submit", {
    method: "POST",
  });

  return parseSurveyResponse(response);
}
