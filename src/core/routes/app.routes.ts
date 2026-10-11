export const appRoutes = {
  home: "/",
  survey: "/survey",
  surveyThanks: "/survey/thanks",
  privacy: "/privacidad",
  dashboard: "/dashboard",
  dashboardLogin: "/dashboard/login",
} as const;

export type AppRoute = (typeof appRoutes)[keyof typeof appRoutes];
