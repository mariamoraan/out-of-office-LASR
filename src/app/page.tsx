import { Suspense } from "react";

import { LandingPage } from "@/app/landing-page/landing-page";
import { surveyDependencies } from "@/features/survey/infrastructure/survey-dependencies";
import { readSurveySessionToken } from "@/features/survey/infrastructure/survey-session";
import { hasSubmittedSurveyForSession } from "@/features/survey/use-cases/queries/has-submitted-survey-for-session.query";

export default function Home() {
  return (
    <Suspense fallback={<LandingPage />}>
      <HomeLanding />
    </Suspense>
  );
}

async function HomeLanding() {
  const sessionToken = await readSurveySessionToken();
  const hasSubmittedSurvey = await hasSubmittedSurveyForSession(
    sessionToken,
    surveyDependencies,
  );

  return <LandingPage hasSubmittedSurvey={hasSubmittedSurvey} />;
}
