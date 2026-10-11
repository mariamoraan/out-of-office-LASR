export const appRoutes = {
  home: "/",
  survey: "/survey",
  surveyThanks: "/survey/thanks",
  dashboard: "/dashboard",
  dashboardLogin: "/dashboard/login",
} as const;

export type AppRoute = (typeof appRoutes)[keyof typeof appRoutes];
