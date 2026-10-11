import type {
  AgeGroup as PrismaAgeGroup,
  Gender as PrismaGender,
  MeetingSlot as PrismaMeetingSlot,
  SurveyResponse as PrismaSurveyResponse,
  WorkArea as PrismaWorkArea,
} from "@prisma/client";

import type {
  AgeGroup,
  Gender,
  MeetingSlot,
  WorkArea,
} from "@/core/constants/survey.constants";
import type {
  SurveyDraftPatch,
  SurveyResponse,
} from "@/features/survey/domain/survey-response";
import type { SurveyStatus } from "@/features/survey/domain/survey-status";

export function toDomainSurveyResponse(
  row: PrismaSurveyResponse,
): SurveyResponse {
  return {
    id: row.id,
    sessionToken: row.sessionToken,
    status: row.status as SurveyStatus,
    fullName: row.fullName,
    ageGroup: row.ageGroup as AgeGroup | null,
    email: row.email,
    whatsapp: row.whatsapp,
    linkedin: row.linkedin,
    instagram: row.instagram,
    xHandle: row.xHandle,
    workAreas: row.workAreas as WorkArea[],
    workAreaOther: row.workAreaOther,
    leisureTags: row.leisureTags,
    leisureOther: row.leisureOther,
    gender: row.gender as Gender | null,
    meetingSlots: row.meetingSlots as MeetingSlot[],
    privacyConsentAcceptedAt: row.privacyConsentAcceptedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    submittedAt: row.submittedAt,
  };
}

export function toPrismaDraftPatch(patch: SurveyDraftPatch): {
  fullName?: string | null;
  ageGroup?: PrismaAgeGroup | null;
  email?: string | null;
  whatsapp?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  xHandle?: string | null;
  workAreas?: PrismaWorkArea[];
  workAreaOther?: string | null;
  leisureTags?: string[];
  leisureOther?: string[];
  gender?: PrismaGender | null;
  meetingSlots?: PrismaMeetingSlot[];
  privacyConsentAcceptedAt?: Date | null;
} {
  return {
    ...(patch.fullName !== undefined ? { fullName: patch.fullName } : {}),
    ...(patch.ageGroup !== undefined
      ? { ageGroup: patch.ageGroup as PrismaAgeGroup | null }
      : {}),
    ...(patch.email !== undefined ? { email: patch.email } : {}),
    ...(patch.whatsapp !== undefined ? { whatsapp: patch.whatsapp } : {}),
    ...(patch.linkedin !== undefined ? { linkedin: patch.linkedin } : {}),
    ...(patch.instagram !== undefined ? { instagram: patch.instagram } : {}),
    ...(patch.xHandle !== undefined ? { xHandle: patch.xHandle } : {}),
    ...(patch.workAreas !== undefined
      ? { workAreas: patch.workAreas as PrismaWorkArea[] }
      : {}),
    ...(patch.workAreaOther !== undefined
      ? { workAreaOther: patch.workAreaOther }
      : {}),
    ...(patch.leisureTags !== undefined
      ? { leisureTags: patch.leisureTags }
      : {}),
    ...(patch.leisureOther !== undefined
      ? { leisureOther: patch.leisureOther }
      : {}),
    ...(patch.gender !== undefined
      ? { gender: patch.gender as PrismaGender | null }
      : {}),
    ...(patch.meetingSlots !== undefined
      ? { meetingSlots: patch.meetingSlots as PrismaMeetingSlot[] }
      : {}),
    ...(patch.privacyConsentAcceptedAt !== undefined
      ? { privacyConsentAcceptedAt: patch.privacyConsentAcceptedAt }
      : {}),
  };
}
