import type {
  AgeGroup,
  Gender,
  MeetingSlot,
  WorkArea,
} from "@/core/constants/survey.constants";
import type { SurveyStatus } from "@/features/survey/domain/survey-status";

export type StatusFilter = SurveyStatus | null;

export type FilterState = {
  status: StatusFilter;
  ageGroups: AgeGroup[];
  workAreas: WorkArea[];
  meetingSlots: MeetingSlot[];
  genders: Gender[];
  search: string;
  page: number;
};

export const INITIAL_FILTERS: FilterState = {
  status: "submitted",
  ageGroups: [],
  workAreas: [],
  meetingSlots: [],
  genders: [],
  search: "",
  page: 1,
};

export function toggleFilterValue<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function hasActiveFilters(filters: FilterState): boolean {
  return countActiveFilters(filters) > 0;
}

export function countActiveFilters(filters: FilterState): number {
  let count = 0;

  if (filters.status !== null) {
    count += 1;
  }

  count += filters.ageGroups.length;
  count += filters.workAreas.length;
  count += filters.meetingSlots.length;
  count += filters.genders.length;

  if (filters.search.trim().length > 0) {
    count += 1;
  }

  return count;
}
