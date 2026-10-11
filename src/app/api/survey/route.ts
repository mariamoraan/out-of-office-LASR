import { NextResponse } from "next/server";

import type { SurveyDraftPatch } from "@/features/survey/domain/survey-response";
import { surveyDependencies } from "@/features/survey/infrastructure/survey-dependencies";
import { toSurveyErrorResponse } from "@/features/survey/infrastructure/http/survey-http-error";
import { toSurveyResponseDto } from "@/features/survey/infrastructure/survey-response.dto";
import { ensureSurveySessionToken } from "@/features/survey/infrastructure/survey-session";
import { createSurveyDraft } from "@/features/survey/use-cases/commands/create-survey-draft.command";
import { updateSurveyDraft } from "@/features/survey/use-cases/commands/update-survey-draft.command";

export async function GET() {
  try {
    const sessionToken = await ensureSurveySessionToken();
    const survey = await createSurveyDraft(sessionToken, surveyDependencies);

    return NextResponse.json({ survey: toSurveyResponseDto(survey) });
  } catch (error) {
    return toSurveyErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const sessionToken = await ensureSurveySessionToken();
    const body = (await request.json()) as SurveyDraftPatch;
    const survey = await updateSurveyDraft(
      sessionToken,
      body,
      surveyDependencies,
    );

    return NextResponse.json({ survey: toSurveyResponseDto(survey) });
  } catch (error) {
    return toSurveyErrorResponse(error);
  }
}
