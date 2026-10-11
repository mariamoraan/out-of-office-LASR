import { PrismaSurveyResponseRepository } from "@/features/survey/infrastructure/repositories/prisma-survey-response.repository";

const surveyResponseRepository = new PrismaSurveyResponseRepository();

export const surveyDependencies = {
  surveyResponseRepository,
};
