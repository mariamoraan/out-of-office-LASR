import type {
  SurveyDraftPatch,
  SurveyResponse,
} from "@/features/survey/domain/survey-response";
import type { SurveyResponseRepository } from "@/features/survey/domain/ports/survey-response.repository";
import { SurveyDomainError } from "@/features/survey/domain/survey-domain-error";

type Dependencies = {
  surveyResponseRepository: SurveyResponseRepository;
};

function normalizeOptionalText(
  value: string | null | undefined,
): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export async function updateSurveyDraft(
  sessionToken: string,
  patch: SurveyDraftPatch,
  { surveyResponseRepository }: Dependencies,
): Promise<SurveyResponse> {
  const existing =
    await surveyResponseRepository.findBySessionToken(sessionToken);

  if (!existing) {
    throw new SurveyDomainError(
      "SURVEY_NOT_FOUND",
      "Survey draft was not found for this session.",
    );
  }

  const normalizedPatch: SurveyDraftPatch = { ...patch };

  if (patch.fullName !== undefined) {
    normalizedPatch.fullName = normalizeOptionalText(patch.fullName) ?? null;
  }
  if (patch.email !== undefined) {
    normalizedPatch.email = normalizeOptionalText(patch.email) ?? null;
  }
  if (patch.whatsapp !== undefined) {
    normalizedPatch.whatsapp = normalizeOptionalText(patch.whatsapp) ?? null;
  }
  if (patch.linkedin !== undefined) {
    normalizedPatch.linkedin = normalizeOptionalText(patch.linkedin) ?? null;
  }
  if (patch.instagram !== undefined) {
    normalizedPatch.instagram = normalizeOptionalText(patch.instagram) ?? null;
  }
  if (patch.xHandle !== undefined) {
    normalizedPatch.xHandle = normalizeOptionalText(patch.xHandle) ?? null;
  }
  if (patch.workAreaOther !== undefined) {
    normalizedPatch.workAreaOther =
      normalizeOptionalText(patch.workAreaOther) ?? null;
  }
  if (patch.leisureOther !== undefined) {
    normalizedPatch.leisureOther =
      normalizeOptionalText(patch.leisureOther) ?? null;
  }
  if (patch.privacyConsentAcceptedAt !== undefined) {
    // Always stamp acceptance with server time; null clears consent.
    normalizedPatch.privacyConsentAcceptedAt =
      patch.privacyConsentAcceptedAt == null ? null : new Date();
  }

  return surveyResponseRepository.updateDraft(sessionToken, normalizedPatch);
}
