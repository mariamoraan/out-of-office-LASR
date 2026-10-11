export const AGE_GROUPS = [
  "AGE_18_25",
  "AGE_26_39",
  "AGE_40_54",
  "AGE_55_PLUS",
] as const;

export type AgeGroup = (typeof AGE_GROUPS)[number];

export const GENDERS = [
  "mujer",
  "hombre",
  "no_binario",
  "prefiero_no_decirlo",
] as const;

export type Gender = (typeof GENDERS)[number];

export const WORK_AREAS = [
  "engineering_development",
  "product_management",
  "ux_ui_design",
  "data_ai",
  "marketing_growth",
  "entrepreneurship_founders",
  "qa_devops_systems",
  "other_tech",
] as const;

export type WorkArea = (typeof WORK_AREAS)[number];

export const MEETING_SLOTS = [
  "wed_14_19_00",
  "mon_19_19_00",
  "wed_21_19_00",
] as const;

export type MeetingSlot = (typeof MEETING_SLOTS)[number];

export const LEISURE_TAGS = [
  "padel",
  "hiking",
  "sewing",
  "running",
  "yoga",
  "wine",
  "fine_dining",
  "museums",
  "camping",
  "painting",
] as const;

export type LeisureTag = (typeof LEISURE_TAGS)[number];
