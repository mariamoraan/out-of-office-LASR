import type { SurveyResponse } from "@/features/survey/domain/survey-response";
import { SurveyDomainError } from "@/features/survey/domain/survey-domain-error";

function hasText(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

function hasContactMethod(
  email: string | null | undefined,
  whatsapp: string | null | undefined,
): boolean {
  return hasText(email) || hasText(whatsapp);
}

export function assertPrivacyConsentAccepted(
  privacyConsentAcceptedAt: Date | null | undefined,
): void {
  if (!privacyConsentAcceptedAt) {
    throw new SurveyDomainError(
      "SURVEY_PRIVACY_CONSENT_REQUIRED",
      "Privacy and contact consent is required to submit.",
    );
  }
}

export function assertCanSubmit(survey: SurveyResponse): void {
  if (survey.status === "submitted") {
    throw new SurveyDomainError(
      "SURVEY_ALREADY_SUBMITTED",
      "Survey has already been submitted.",
    );
  }

  if (!hasText(survey.fullName)) {
    throw new SurveyDomainError(
      "SURVEY_FULL_NAME_REQUIRED",
      "Full name is required to submit.",
    );
  }

  if (hasContactMethod(survey.email, survey.whatsapp)) {
    assertPrivacyConsentAccepted(survey.privacyConsentAcceptedAt);
  }

  if (survey.meetingSlots.length === 0) {
    throw new SurveyDomainError(
      "SURVEY_MEETING_SLOT_REQUIRED",
      "At least one meeting slot is required to submit.",
    );
  }
}
