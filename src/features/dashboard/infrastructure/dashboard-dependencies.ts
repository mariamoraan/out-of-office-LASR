import { PrismaAdminSurveyReadRepository } from "@/features/dashboard/infrastructure/repositories/prisma-admin-survey-read.repository";
import { PrismaAdminSurveyWriteRepository } from "@/features/dashboard/infrastructure/repositories/prisma-admin-survey-write.repository";

const adminSurveyReadRepository = new PrismaAdminSurveyReadRepository();
const adminSurveyWriteRepository = new PrismaAdminSurveyWriteRepository();

export const dashboardDependencies = {
  adminSurveyReadRepository,
  adminSurveyWriteRepository,
};
