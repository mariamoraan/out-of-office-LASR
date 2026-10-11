import type { SurveyResponse } from "@/features/survey/domain/survey-response";
import { SurveyDomainError } from "@/features/survey/domain/survey-domain-error";

function hasText(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

export function assertHasContact(
  email: string | null | undefined,
  whatsapp: string | null | undefined,
): void {
  if (!hasText(email) && !hasText(whatsapp)) {
    throw new SurveyDomainError(
      "SURVEY_CONTACT_REQUIRED",
      "At least one contact method (email or WhatsApp) is required.",
    );
  }
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

  if (!survey.ageGroup) {
    throw new SurveyDomainError(
      "SURVEY_AGE_GROUP_REQUIRED",
      "Age group is required to submit.",
    );
  }

  assertHasContact(survey.email, survey.whatsapp);
  assertPrivacyConsentAccepted(survey.privacyConsentAcceptedAt);

  if (survey.workAreas.length === 0) {
    throw new SurveyDomainError(
      "SURVEY_WORK_AREA_REQUIRED",
      "At least one work area is required to submit.",
    );
  }

  if (survey.leisureTags.length === 0 && !hasText(survey.leisureOther)) {
    throw new SurveyDomainError(
      "SURVEY_LEISURE_REQUIRED",
      "At least one leisure interest is required to submit.",
    );
  }

  if (!survey.gender) {
    throw new SurveyDomainError(
      "SURVEY_GENDER_REQUIRED",
      "Gender is required to submit.",
    );
  }

  if (survey.meetingSlots.length === 0) {
    throw new SurveyDomainError(
      "SURVEY_MEETING_SLOT_REQUIRED",
      "At least one meeting slot is required to submit.",
    );
  }
}
