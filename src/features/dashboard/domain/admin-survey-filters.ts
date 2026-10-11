import type {
  AgeGroup,
  Gender,
  MeetingSlot,
  WorkArea,
} from "@/core/constants/survey.constants";
import type { SurveyResponse } from "@/features/survey/domain/survey-response";
import type { SurveyStatus } from "@/features/survey/domain/survey-status";

export const ADMIN_SURVEY_LIST_DEFAULT_PAGE_SIZE = 50;
export const ADMIN_SURVEY_LIST_MAX_PAGE_SIZE = 100;

export type AdminSurveyListFilters = {
  /** Omit or undefined = all statuses. */
  status?: SurveyStatus;
  ageGroups: AgeGroup[];
  workAreas: WorkArea[];
  meetingSlots: MeetingSlot[];
  genders: Gender[];
  search: string;
  page: number;
  pageSize: number;
};

export type AdminSurveyListResult = {
  items: SurveyResponse[];
  total: number;
  page: number;
  pageSize: number;
};
