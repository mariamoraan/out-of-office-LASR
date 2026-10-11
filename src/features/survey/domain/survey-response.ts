import type {
  AgeGroup,
  Gender,
  MeetingSlot,
  WorkArea,
} from "@/core/constants/survey.constants";
import type { SurveyStatus } from "@/features/survey/domain/survey-status";

export type SurveyResponse = {
  id: string;
  sessionToken: string;
  status: SurveyStatus;
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
  leisureOther: string[];
  gender: Gender | null;
  meetingSlots: MeetingSlot[];
  privacyConsentAcceptedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  submittedAt: Date | null;
};

export type SurveyDraftPatch = Partial<{
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
  leisureOther: string[];
  gender: Gender | null;
  meetingSlots: MeetingSlot[];
  privacyConsentAcceptedAt: Date | null;
}>;
