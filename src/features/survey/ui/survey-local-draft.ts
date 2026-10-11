import { SURVEY_LOCAL_DRAFT_KEY } from "@/core/constants/app.constants";
import type {
  AgeGroup,
  Gender,
  MeetingSlot,
  WorkArea,
} from "@/core/constants/survey.constants";

export type SurveyLocalDraftFields = {
  fullName: string | null;
  ageGroup: AgeGroup | null;
  email: string | null;
  whatsapp: string | null;
  linkedin: string | null;
  instagram: string | null;
  xHandle: string | null;
  workAreas: WorkArea[];
  workAreaOther: string | null;
  leisureTags: string[];
  leisureOther: string | null;
  gender: Gender | null;
  meetingSlots: MeetingSlot[];
};

export type SurveyLocalDraft = {
  id: string;
  stepIndex: number;
  fields: SurveyLocalDraftFields;
};

export function toSurveyLocalDraftFields(
  source: SurveyLocalDraftFields,
): SurveyLocalDraftFields {
  return {
    fullName: source.fullName,
    ageGroup: source.ageGroup,
    email: source.email,
    whatsapp: source.whatsapp,
    linkedin: source.linkedin,
    instagram: source.instagram,
    xHandle: source.xHandle,
    workAreas: source.workAreas,
    workAreaOther: source.workAreaOther,
    leisureTags: source.leisureTags,
    leisureOther: source.leisureOther,
    gender: source.gender,
    meetingSlots: source.meetingSlots,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringOrNull(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function parseFields(value: unknown): SurveyLocalDraftFields | null {
  if (!isRecord(value)) {
    return null;
  }

  const {
    fullName,
    ageGroup,
    email,
    whatsapp,
    linkedin,
    instagram,
    xHandle,
    workAreas,
    workAreaOther,
    leisureTags,
    leisureOther,
    gender,
    meetingSlots,
  } = value;

  if (
    !isStringOrNull(fullName) ||
    !isStringOrNull(ageGroup) ||
    !isStringOrNull(email) ||
    !isStringOrNull(whatsapp) ||
    !isStringOrNull(linkedin) ||
    !isStringOrNull(instagram) ||
    !isStringOrNull(xHandle) ||
    !isStringArray(workAreas) ||
    !isStringOrNull(workAreaOther) ||
    !isStringArray(leisureTags) ||
    !isStringOrNull(leisureOther) ||
    !isStringOrNull(gender) ||
    !isStringArray(meetingSlots)
  ) {
    return null;
  }

  return {
    fullName,
    ageGroup: ageGroup as AgeGroup | null,
    email,
    whatsapp,
    linkedin,
    instagram,
    xHandle,
    workAreas: workAreas as WorkArea[],
    workAreaOther,
    leisureTags,
    leisureOther,
    gender: gender as Gender | null,
    meetingSlots: meetingSlots as MeetingSlot[],
  };
}

function parseLocalDraft(value: unknown): SurveyLocalDraft | null {
  if (!isRecord(value)) {
    return null;
  }

  const { id, stepIndex, fields } = value;

  if (typeof id !== "string" || id.length === 0) {
    return null;
  }

  if (typeof stepIndex !== "number" || !Number.isInteger(stepIndex) || stepIndex < 0) {
    return null;
  }

  const parsedFields = parseFields(fields);
  if (!parsedFields) {
    return null;
  }

  return { id, stepIndex, fields: parsedFields };
}

export function readSurveyLocalDraft(): SurveyLocalDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SURVEY_LOCAL_DRAFT_KEY);
    if (!raw) {
      return null;
    }

    return parseLocalDraft(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export function writeSurveyLocalDraft(draft: SurveyLocalDraft): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(SURVEY_LOCAL_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Quota / private mode — ignore; server draft remains source of truth.
  }
}

export function clearSurveyLocalDraft(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(SURVEY_LOCAL_DRAFT_KEY);
  } catch {
    // Ignore storage failures on clear.
  }
}
