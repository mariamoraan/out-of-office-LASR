import { NextResponse } from "next/server";

import { surveyDependencies } from "@/features/survey/infrastructure/survey-dependencies";
import { toSurveyErrorResponse } from "@/features/survey/infrastructure/http/survey-http-error";
import { toSurveyResponseDto } from "@/features/survey/infrastructure/survey-response.dto";
import { ensureSurveySessionToken } from "@/features/survey/infrastructure/survey-session";
import { submitSurvey } from "@/features/survey/use-cases/commands/submit-survey.command";

export async function POST() {
  try {
    const sessionToken = await ensureSurveySessionToken();
    const survey = await submitSurvey(sessionToken, surveyDependencies);

    return NextResponse.json({ survey: toSurveyResponseDto(survey) });
  } catch (error) {
    return toSurveyErrorResponse(error);
  }
}
