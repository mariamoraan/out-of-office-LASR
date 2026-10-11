import type { SurveyStepId } from "@/features/survey/domain/survey-steps";

export type SurveyStepFocusDraft = {
  ageGroup: string | null;
  email: string | null;
  whatsapp: string | null;
  workAreas: string[];
  leisureTags: string[];
  leisureOther: string | null;
  gender: string | null;
  meetingSlots: string[];
  privacyConsentAcceptedAt: string | null;
};

export type SurveyStepFocusTarget =
  | "privacyConsent"
  | "ageGroupFirst"
  | "genderFirst"
  | "workFirst"
  | "leisureFirst"
  | "meetingFirst";

function hasText(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

/**
 * Returns which control should receive focus when entering a survey step,
 * or null when the step title should receive focus instead.
 *
 * Text inputs are never autofocused (avoids opening the mobile keyboard
 * mid step-transition). Choice rows, chips, and consent stay eligible.
 */
export function getSurveyStepFocusTarget(
  stepId: SurveyStepId,
  draft: SurveyStepFocusDraft,
): SurveyStepFocusTarget | null {
  switch (stepId) {
    case "fullName":
      return null;

    case "ageGroup":
      return draft.ageGroup ? null : "ageGroupFirst";

    case "contact":
      if (
        (hasText(draft.email) || hasText(draft.whatsapp)) &&
        !draft.privacyConsentAcceptedAt
      ) {
        return "privacyConsent";
      }
      return null;

    case "social":
      return null;

    case "work":
      return draft.workAreas.length === 0 ? "workFirst" : null;

    case "leisure":
      if (draft.leisureTags.length === 0 && !hasText(draft.leisureOther)) {
        return "leisureFirst";
      }
      return null;

    case "gender":
      return draft.gender ? null : "genderFirst";

    case "meeting":
      return draft.meetingSlots.length === 0 ? "meetingFirst" : null;

    default: {
      const _exhaustive: never = stepId;
      return _exhaustive;
    }
  }
}
