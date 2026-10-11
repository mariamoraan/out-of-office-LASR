import { prisma } from "@/core/db/prisma-client";
import type {
  SurveyDraftPatch,
  SurveyResponse,
} from "@/features/survey/domain/survey-response";
import { SurveyDomainError } from "@/features/survey/domain/survey-domain-error";
import type { SurveyResponseRepository } from "@/features/survey/domain/ports/survey-response.repository";
import {
  toDomainSurveyResponse,
  toPrismaDraftPatch,
} from "@/features/survey/infrastructure/mappers/survey-response.mapper";

export class PrismaSurveyResponseRepository
  implements SurveyResponseRepository
{
  async createDraft(sessionToken: string): Promise<SurveyResponse> {
    const row = await prisma.surveyResponse.create({
      data: {
        sessionToken,
        status: "draft",
      },
    });

    return toDomainSurveyResponse(row);
  }

  async findBySessionToken(
    sessionToken: string,
  ): Promise<SurveyResponse | null> {
    const row = await prisma.surveyResponse.findUnique({
      where: { sessionToken },
    });

    return row ? toDomainSurveyResponse(row) : null;
  }

  async updateDraft(
    sessionToken: string,
    patch: SurveyDraftPatch,
  ): Promise<SurveyResponse> {
    const existing = await this.findBySessionToken(sessionToken);

    if (!existing) {
      throw new SurveyDomainError(
        "SURVEY_NOT_FOUND",
        "Survey draft was not found for this session.",
      );
    }

    const row = await prisma.surveyResponse.update({
      where: { sessionToken },
      data: toPrismaDraftPatch(patch),
    });

    return toDomainSurveyResponse(row);
  }

  async markSubmitted(
    sessionToken: string,
    submittedAt: Date,
  ): Promise<SurveyResponse> {
    const existing = await this.findBySessionToken(sessionToken);

    if (!existing) {
      throw new SurveyDomainError(
        "SURVEY_NOT_FOUND",
        "Survey draft was not found for this session.",
      );
    }

    if (existing.status === "submitted") {
      throw new SurveyDomainError(
        "SURVEY_ALREADY_SUBMITTED",
        "Survey has already been submitted.",
      );
    }

    const row = await prisma.surveyResponse.update({
      where: { sessionToken },
      data: {
        status: "submitted",
        submittedAt,
      },
    });

    return toDomainSurveyResponse(row);
  }
}
