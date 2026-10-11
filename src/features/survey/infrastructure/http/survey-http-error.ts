import { NextResponse } from "next/server";

import { SurveyDomainError } from "@/features/survey/domain/survey-domain-error";

export function toSurveyErrorResponse(error: unknown) {
  if (error instanceof SurveyDomainError) {
    const status =
      error.code === "SURVEY_NOT_FOUND"
        ? 404
        : error.code === "SURVEY_ALREADY_SUBMITTED"
          ? 409
          : 400;

    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status },
    );
  }

  console.error(error);
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: "Unexpected error." } },
    { status: 500 },
  );
}
