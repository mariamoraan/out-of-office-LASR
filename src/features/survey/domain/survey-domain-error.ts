export type SurveyDomainErrorCode =
  | "SURVEY_NOT_FOUND"
  | "SURVEY_ALREADY_SUBMITTED"
  | "SURVEY_PRIVACY_CONSENT_REQUIRED"
  | "SURVEY_FULL_NAME_REQUIRED"
  | "SURVEY_MEETING_SLOT_REQUIRED";

export class SurveyDomainError extends Error {
  readonly code: SurveyDomainErrorCode;

  constructor(code: SurveyDomainErrorCode, message: string) {
    super(message);
    this.name = "SurveyDomainError";
    this.code = code;
  }
}
