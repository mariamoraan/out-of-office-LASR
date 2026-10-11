import type { SurveyResponse } from "@/features/survey/domain/survey-response";

/** Admin-facing survey DTO — omits anonymous session token. */
export type AdminSurveyResponseDto = {
  id: string;
  status: SurveyResponse["status"];
  fullName: string | null;
  ageGroup: SurveyResponse["ageGroup"];
  email: string | null;
  whatsapp: string | null;
  linkedin: string | null;
  instagram: string | null;
  xHandle: string | null;
  workAreas: SurveyResponse["workAreas"];
  workAreaOther: string | null;
  leisureTags: string[];
  leisureOther: string | null;
  gender: SurveyResponse["gender"];
  meetingSlots: SurveyResponse["meetingSlots"];
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
};

export function toAdminSurveyResponseDto(
  survey: SurveyResponse,
): AdminSurveyResponseDto {
  return {
    id: survey.id,
    status: survey.status,
    fullName: survey.fullName,
    ageGroup: survey.ageGroup,
    email: survey.email,
    whatsapp: survey.whatsapp,
    linkedin: survey.linkedin,
    instagram: survey.instagram,
    xHandle: survey.xHandle,
    workAreas: survey.workAreas,
    workAreaOther: survey.workAreaOther,
    leisureTags: survey.leisureTags,
    leisureOther: survey.leisureOther,
    gender: survey.gender,
    meetingSlots: survey.meetingSlots,
    createdAt: survey.createdAt.toISOString(),
    updatedAt: survey.updatedAt.toISOString(),
    submittedAt: survey.submittedAt ? survey.submittedAt.toISOString() : null,
  };
}
