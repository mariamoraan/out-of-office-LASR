import type { AdminSurveyResponseDto } from "@/features/dashboard/infrastructure/admin-survey-response.dto";
import type { AgeGroup, Gender, MeetingSlot, WorkArea } from "@/core/constants/survey.constants";
import type { SurveyStatus } from "@/features/survey/domain/survey-status";

type AdminApiError = {
  error: {
    code: string;
    message: string;
  };
};

export class DashboardApiError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "DashboardApiError";
    this.code = code;
  }
}

export type AdminSurveyListQuery = {
  status?: SurveyStatus;
  ageGroups: AgeGroup[];
  workAreas: WorkArea[];
  meetingSlots: MeetingSlot[];
  genders: Gender[];
  search: string;
  page: number;
  pageSize: number;
};

export type AdminSurveyListResponse = {
  items: AdminSurveyResponseDto[];
  total: number;
  page: number;
  pageSize: number;
};

async function parseAdminOkResponse(response: Response): Promise<void> {
  const payload = (await response.json()) as { ok?: boolean } | AdminApiError;

  if (!response.ok) {
    if ("error" in payload) {
      throw new DashboardApiError(payload.error.code, payload.error.message);
    }

    throw new DashboardApiError("INTERNAL_ERROR", "Request failed");
  }
}

export async function loginAdminRequest(input: {
  username: string;
  password: string;
}): Promise<void> {
  const response = await fetch("/api/dashboard/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  await parseAdminOkResponse(response);
}

export async function logoutAdminRequest(): Promise<void> {
  const response = await fetch("/api/dashboard/logout", {
    method: "POST",
  });

  await parseAdminOkResponse(response);
}

function buildListSearchParams(query: AdminSurveyListQuery): URLSearchParams {
  const params = new URLSearchParams();

  if (query.status) {
    params.set("status", query.status);
  }

  for (const ageGroup of query.ageGroups) {
    params.append("ageGroup", ageGroup);
  }

  for (const workArea of query.workAreas) {
    params.append("workArea", workArea);
  }

  for (const meetingSlot of query.meetingSlots) {
    params.append("meetingSlot", meetingSlot);
  }

  for (const gender of query.genders) {
    params.append("gender", gender);
  }

  const search = query.search.trim();
  if (search) {
    params.set("search", search);
  }

  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));

  return params;
}

export async function fetchAdminSurveyResponses(
  query: AdminSurveyListQuery,
  signal?: AbortSignal,
): Promise<AdminSurveyListResponse> {
  const params = buildListSearchParams(query);
  const response = await fetch(`/api/dashboard/responses?${params}`, {
    method: "GET",
    cache: "no-store",
    signal,
  });

  const payload = (await response.json()) as
    | AdminSurveyListResponse
    | AdminApiError;

  if (!response.ok) {
    if ("error" in payload) {
      throw new DashboardApiError(payload.error.code, payload.error.message);
    }

    throw new DashboardApiError("INTERNAL_ERROR", "Request failed");
  }

  return payload as AdminSurveyListResponse;
}

export type AdminSurveyDeleteResponse = {
  deleted: number;
};

export async function deleteAdminSurveyResponsesRequest(
  ids: string[],
): Promise<AdminSurveyDeleteResponse> {
  const response = await fetch("/api/dashboard/responses", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });

  const payload = (await response.json()) as
    | AdminSurveyDeleteResponse
    | AdminApiError;

  if (!response.ok) {
    if ("error" in payload) {
      throw new DashboardApiError(payload.error.code, payload.error.message);
    }

    throw new DashboardApiError("INTERNAL_ERROR", "Request failed");
  }

  return payload as AdminSurveyDeleteResponse;
}
