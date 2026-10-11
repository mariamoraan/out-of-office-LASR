import Link from "next/link";

import { getDictionary } from "@/core/i18n";
import { appRoutes } from "@/core/routes/app.routes";

import "./landing-page.scss";

export function LandingPage() {
  const t = getDictionary("es");

  return (
    <main className="f-landing">
      <p className="f-landing__brand">{t.appName}</p>
      <h1 className="f-landing__title">{t.home.title}</h1>
      <p className="f-landing__subtitle">{t.home.subtitle}</p>
      <p className="f-landing__tagline">{t.home.tagline}</p>
      <Link className="f-landing__cta" href={appRoutes.survey}>
        {t.home.cta}
      </Link>
    </main>
  );
}
