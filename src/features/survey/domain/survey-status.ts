export const SURVEY_STATUSES = ["draft", "submitted"] as const;

export type SurveyStatus = (typeof SURVEY_STATUSES)[number];
