export const ADMIN_SURVEY_STATS_DIMENSIONS = [
  "meetingSlots",
  "ageGroup",
  "workAreas",
  "leisureTags",
  "gender",
] as const;

export type AdminSurveyStatsDimension =
  (typeof ADMIN_SURVEY_STATS_DIMENSIONS)[number];

export const ADMIN_SURVEY_STATS_DEFAULT_DIMENSION: AdminSurveyStatsDimension =
  "meetingSlots";

export type AdminSurveyStatsBucket = {
  key: string;
  count: number;
};

export type AdminSurveyStatsResult = {
  dimension: AdminSurveyStatsDimension;
  totalResponses: number;
  buckets: AdminSurveyStatsBucket[];
};
