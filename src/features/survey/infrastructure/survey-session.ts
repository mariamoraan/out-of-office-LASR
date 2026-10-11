import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

import { SURVEY_SESSION_COOKIE } from "@/core/constants/app.constants";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function readSurveySessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SURVEY_SESSION_COOKIE)?.value;
}

export async function ensureSurveySessionToken(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(SURVEY_SESSION_COOKIE)?.value;

  if (existing) {
    return existing;
  }

  const token = randomUUID();
  cookieStore.set(SURVEY_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return token;
}
