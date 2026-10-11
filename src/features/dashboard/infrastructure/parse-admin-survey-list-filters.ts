import {
  AGE_GROUPS,
  GENDERS,
  MEETING_SLOTS,
  WORK_AREAS,
  type AgeGroup,
  type Gender,
  type MeetingSlot,
  type WorkArea,
} from "@/core/constants/survey.constants";
import {
  ADMIN_SURVEY_LIST_DEFAULT_PAGE_SIZE,
  ADMIN_SURVEY_LIST_MAX_PAGE_SIZE,
  type AdminSurveyListFilters,
} from "@/features/dashboard/domain/admin-survey-filters";
import {
  SURVEY_STATUSES,
  type SurveyStatus,
} from "@/features/survey/domain/survey-status";

function collectParamValues(
  params: URLSearchParams,
  key: string,
): string[] {
  const values = params
    .getAll(key)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return values;
}

function parseEnumList<T extends string>(
  values: string[],
  allowed: readonly T[],
): T[] {
  const allowedSet = new Set<string>(allowed);
  const seen = new Set<T>();

  for (const value of values) {
    if (allowedSet.has(value)) {
      seen.add(value as T);
    }
  }

  return [...seen];
}

function parsePositiveInt(
  raw: string | null,
  fallback: number,
  max?: number,
): number {
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  if (max !== undefined) {
    return Math.min(parsed, max);
  }

  return parsed;
}

export function parseAdminSurveyListFilters(
  params: URLSearchParams,
): AdminSurveyListFilters {
  const statusRaw = params.get("status")?.trim();
  const status =
    statusRaw &&
    (SURVEY_STATUSES as readonly string[]).includes(statusRaw)
      ? (statusRaw as SurveyStatus)
      : undefined;

  return {
    status,
    ageGroups: parseEnumList(
      collectParamValues(params, "ageGroup"),
      AGE_GROUPS,
    ) as AgeGroup[],
    workAreas: parseEnumList(
      collectParamValues(params, "workArea"),
      WORK_AREAS,
    ) as WorkArea[],
    meetingSlots: parseEnumList(
      collectParamValues(params, "meetingSlot"),
      MEETING_SLOTS,
    ) as MeetingSlot[],
    genders: parseEnumList(
      collectParamValues(params, "gender"),
      GENDERS,
    ) as Gender[],
    search: params.get("search")?.trim() ?? "",
    page: parsePositiveInt(params.get("page"), 1),
    pageSize: parsePositiveInt(
      params.get("pageSize"),
      ADMIN_SURVEY_LIST_DEFAULT_PAGE_SIZE,
      ADMIN_SURVEY_LIST_MAX_PAGE_SIZE,
    ),
  };
}
