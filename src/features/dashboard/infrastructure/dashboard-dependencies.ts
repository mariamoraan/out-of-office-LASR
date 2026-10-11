import { PrismaAdminSurveyReadRepository } from "@/features/dashboard/infrastructure/repositories/prisma-admin-survey-read.repository";

const adminSurveyReadRepository = new PrismaAdminSurveyReadRepository();

export const dashboardDependencies = {
  adminSurveyReadRepository,
};
