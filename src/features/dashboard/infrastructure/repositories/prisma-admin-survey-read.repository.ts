import type { Prisma } from "@prisma/client";

import { prisma } from "@/core/db/prisma-client";
import type {
  AdminSurveyListFilters,
  AdminSurveyListResult,
} from "@/features/dashboard/domain/admin-survey-filters";
import type { AdminSurveyReadRepository } from "@/features/dashboard/domain/ports/admin-survey-read.repository";
import type { SurveyResponse } from "@/features/survey/domain/survey-response";
import { toDomainSurveyResponse } from "@/features/survey/infrastructure/mappers/survey-response.mapper";

function buildWhere(
  filters: AdminSurveyListFilters,
): Prisma.SurveyResponseWhereInput {
  const search = filters.search.trim();
  const where: Prisma.SurveyResponseWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.ageGroups.length > 0) {
    where.ageGroup = { in: filters.ageGroups };
  }

  if (filters.genders.length > 0) {
    where.gender = { in: filters.genders };
  }

  if (filters.workAreas.length > 0) {
    where.workAreas = { hasSome: filters.workAreas };
  }

  if (filters.meetingSlots.length > 0) {
    where.meetingSlots = { hasSome: filters.meetingSlots };
  }

  if (search.length > 0) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { whatsapp: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
}

export class PrismaAdminSurveyReadRepository
  implements AdminSurveyReadRepository
{
  async list(filters: AdminSurveyListFilters): Promise<AdminSurveyListResult> {
    const where = buildWhere(filters);
    const skip = (filters.page - 1) * filters.pageSize;

    const [rows, total] = await Promise.all([
      prisma.surveyResponse.findMany({
        where,
        orderBy: [
          { submittedAt: { sort: "desc", nulls: "last" } },
          { updatedAt: "desc" },
        ],
        skip,
        take: filters.pageSize,
      }),
      prisma.surveyResponse.count({ where }),
    ]);

    return {
      items: rows.map(toDomainSurveyResponse),
      total,
      page: filters.page,
      pageSize: filters.pageSize,
    };
  }

  async findById(id: string): Promise<SurveyResponse | null> {
    const row = await prisma.surveyResponse.findUnique({
      where: { id },
    });

    return row ? toDomainSurveyResponse(row) : null;
  }
}
