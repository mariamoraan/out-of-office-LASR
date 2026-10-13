"use client";

import Link from "next/link";

import { getDictionary } from "@/core/i18n";
import { appRoutes } from "@/core/routes/app.routes";

import "./dashboard-nav.scss";

type DashboardNavProps = {
  active: "responses" | "stats";
};

export function DashboardNav({ active }: DashboardNavProps) {
  const t = getDictionary("es");
  const nav = t.dashboard.nav;

  return (
    <nav className="f-dashboard-nav" aria-label={nav.ariaLabel}>
      <Link
        href={appRoutes.dashboard}
        className={[
          "f-dashboard-nav__link",
          active === "responses" ? "f-dashboard-nav__link--active" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-current={active === "responses" ? "page" : undefined}
      >
        {nav.responses}
      </Link>
      <Link
        href={appRoutes.dashboardStats}
        className={[
          "f-dashboard-nav__link",
          active === "stats" ? "f-dashboard-nav__link--active" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-current={active === "stats" ? "page" : undefined}
      >
        {nav.stats}
      </Link>
    </nav>
  );
}
