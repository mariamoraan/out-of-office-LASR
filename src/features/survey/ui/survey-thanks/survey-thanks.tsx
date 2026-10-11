import Link from "next/link";

import { getDictionary } from "@/core/i18n";
import { appRoutes } from "@/core/routes/app.routes";
import { CommunityArc } from "@/features/survey/ui/community-arc/community-arc";
import { SurveyConfetti } from "@/features/survey/ui/survey-confetti/survey-confetti";

import "./survey-thanks.scss";

export function SurveyThanks() {
  const t = getDictionary("es");

  return (
    <main className="f-survey-thanks">
      <SurveyConfetti />
      <CommunityArc className="f-survey-thanks__community" />
      <p className="f-survey-thanks__brand">{t.appName}</p>
      <h1 className="f-survey-thanks__title">{t.survey.thanks.title}</h1>
      <p className="f-survey-thanks__subtitle">{t.survey.thanks.subtitle}</p>
      <Link className="f-survey-thanks__cta" href={appRoutes.home}>
        {t.survey.thanks.cta}
      </Link>
    </main>
  );
}
