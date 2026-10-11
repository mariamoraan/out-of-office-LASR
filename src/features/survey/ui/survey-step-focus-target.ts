import type { SurveyStepId } from "@/features/survey/domain/survey-steps";

export type SurveyStepFocusDraft = {
  fullName: string | null;
  ageGroup: string | null;
  email: string | null;
  whatsapp: string | null;
  linkedin: string | null;
  instagram: string | null;
  xHandle: string | null;
  workAreas: string[];
  workAreaOther: string | null;
  leisureTags: string[];
  leisureOther: string | null;
  gender: string | null;
  meetingSlots: string[];
};

export type SurveyStepFocusTarget =
  | "fullName"
  | "email"
  | "whatsapp"
  | "linkedin"
  | "instagram"
  | "xHandle"
  | "workAreaOther"
  | "leisureOther"
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
 * or null when the step is already satisfied.
 */
export function getSurveyStepFocusTarget(
  stepId: SurveyStepId,
  draft: SurveyStepFocusDraft,
): SurveyStepFocusTarget | null {
  switch (stepId) {
    case "fullName":
      return hasText(draft.fullName) ? null : "fullName";

    case "ageGroup":
      return draft.ageGroup ? null : "ageGroupFirst";

    case "contact":
      if (!hasText(draft.email)) {
        return "email";
      }
      if (!hasText(draft.whatsapp)) {
        return "whatsapp";
      }
      return null;

    case "social":
      if (!hasText(draft.linkedin)) {
        return "linkedin";
      }
      if (!hasText(draft.instagram)) {
        return "instagram";
      }
      if (!hasText(draft.xHandle)) {
        return "xHandle";
      }
      return null;

    case "work":
      if (draft.workAreas.length === 0) {
        return "workFirst";
      }
      if (
        draft.workAreas.includes("other_tech") &&
        !hasText(draft.workAreaOther)
      ) {
        return "workAreaOther";
      }
      return null;

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
