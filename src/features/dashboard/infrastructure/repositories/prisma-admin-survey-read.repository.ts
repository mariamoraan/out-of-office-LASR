import type { Prisma } from "@prisma/client";

import {
  AGE_GROUPS,
  GENDERS,
  LEISURE_TAGS,
  MEETING_SLOTS,
  WORK_AREAS,
} from "@/core/constants/survey.constants";
import { prisma } from "@/core/db/prisma-client";
import type {
  AdminSurveyListFilters,
  AdminSurveyListResult,
} from "@/features/dashboard/domain/admin-survey-filters";
import type {
  AdminSurveyStatsBucket,
  AdminSurveyStatsDimension,
  AdminSurveyStatsResult,
} from "@/features/dashboard/domain/admin-survey-stats";
import type { AdminSurveyReadRepository } from "@/features/dashboard/domain/ports/admin-survey-read.repository";
import type { SurveyResponse } from "@/features/survey/domain/survey-response";
import { toDomainSurveyResponse } from "@/features/survey/infrastructure/mappers/survey-response.mapper";

const leisureTagSet = new Set<string>(LEISURE_TAGS);

function emptyCounts(keys: readonly string[]): Map<string, number> {
  return new Map(keys.map((key) => [key, 0]));
}

function toBuckets(counts: Map<string, number>): AdminSurveyStatsBucket[] {
  return [...counts.entries()].map(([key, count]) => ({ key, count }));
}

function incrementCount(counts: Map<string, number>, key: string) {
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

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

  async aggregateStats(
    filters: AdminSurveyListFilters,
    dimension: AdminSurveyStatsDimension,
  ): Promise<AdminSurveyStatsResult> {
    const where = buildWhere(filters);
    const rows = await prisma.surveyResponse.findMany({
      where,
      select: {
        ageGroup: true,
        gender: true,
        workAreas: true,
        leisureTags: true,
        meetingSlots: true,
      },
    });

    const totalResponses = rows.length;
    let buckets: AdminSurveyStatsBucket[];

    switch (dimension) {
      case "ageGroup": {
        const counts = emptyCounts(AGE_GROUPS);
        for (const row of rows) {
          if (row.ageGroup) {
            incrementCount(counts, row.ageGroup);
          }
        }
        buckets = toBuckets(counts);
        break;
      }
      case "gender": {
        const counts = emptyCounts(GENDERS);
        for (const row of rows) {
          if (row.gender) {
            incrementCount(counts, row.gender);
          }
        }
        buckets = toBuckets(counts);
        break;
      }
      case "workAreas": {
        const counts = emptyCounts(WORK_AREAS);
        for (const row of rows) {
          for (const area of row.workAreas) {
            if (counts.has(area)) {
              incrementCount(counts, area);
            }
          }
        }
        buckets = toBuckets(counts);
        break;
      }
      case "meetingSlots": {
        const counts = emptyCounts(MEETING_SLOTS);
        for (const row of rows) {
          for (const slot of row.meetingSlots) {
            if (counts.has(slot)) {
              incrementCount(counts, slot);
            }
          }
        }
        buckets = toBuckets(counts);
        break;
      }
      case "leisureTags": {
        const counts = emptyCounts(LEISURE_TAGS);
        for (const row of rows) {
          for (const tag of row.leisureTags) {
            if (leisureTagSet.has(tag)) {
              incrementCount(counts, tag);
            }
          }
        }
        buckets = toBuckets(counts);
        break;
      }
    }

    return {
      dimension,
      totalResponses,
      buckets,
    };
  }
}
