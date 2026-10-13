export const appRoutes = {
  home: "/",
  survey: "/survey",
  surveyThanks: "/survey/thanks",
  privacy: "/privacidad",
  dashboard: "/dashboard",
  dashboardStats: "/dashboard/stats",
  dashboardLogin: "/dashboard/login",
} as const;

export type AppRoute = (typeof appRoutes)[keyof typeof appRoutes];
