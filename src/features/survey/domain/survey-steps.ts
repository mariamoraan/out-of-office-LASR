export const SURVEY_STEPS = [
  "fullName",
  "ageGroup",
  "contact",
  "social",
  "work",
  "leisure",
  "gender",
  "meeting",
] as const;

export type SurveyStepId = (typeof SURVEY_STEPS)[number];

export const SURVEY_STEP_COUNT = SURVEY_STEPS.length;
