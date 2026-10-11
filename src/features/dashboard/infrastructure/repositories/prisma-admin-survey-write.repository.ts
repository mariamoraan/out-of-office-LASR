import { prisma } from "@/core/db/prisma-client";
import type { AdminSurveyWriteRepository } from "@/features/dashboard/domain/ports/admin-survey-write.repository";

export class PrismaAdminSurveyWriteRepository
  implements AdminSurveyWriteRepository
{
  async deleteByIds(ids: string[]): Promise<number> {
    if (ids.length === 0) {
      return 0;
    }

    const result = await prisma.surveyResponse.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return result.count;
  }
}
