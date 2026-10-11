import Link from "next/link";

import { getDictionary } from "@/core/i18n";
import { appRoutes } from "@/core/routes/app.routes";
import { CommunityArc } from "@/features/survey/ui/community-arc/community-arc";

import "./landing-page.scss";

type LandingPageProps = {
  hasSubmittedSurvey?: boolean;
};

export function LandingPage({
  hasSubmittedSurvey = false,
}: LandingPageProps) {
  const t = getDictionary("es");
  const ctaLabel = hasSubmittedSurvey ? t.home.ctaEdit : t.home.cta;

  return (
    <main className="f-landing">
      <CommunityArc className="f-landing__community" />
      <p className="f-landing__brand">{t.appName}</p>
      <h1 className="f-landing__title">{t.home.title}</h1>
      <p className="f-landing__subtitle">{t.home.subtitle}</p>
      <p className="f-landing__tagline">{t.home.tagline}</p>
      <Link className="f-landing__cta" href={appRoutes.survey}>
        {ctaLabel}
      </Link>
    </main>
  );
}
