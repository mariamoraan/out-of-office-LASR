export const APP_NAME = "Out Of Office LASR";

/** Matches `--color-bg` — used for mobile browser chrome / theme-color. */
export const APP_THEME_COLOR = "#f8e9df";

export const SURVEY_SESSION_COOKIE = "survey_session_id";

/** Browser cache for in-progress survey fields + step (cleared on submit). */
export const SURVEY_LOCAL_DRAFT_KEY = "ooo-lasr.survey-draft";

export const ADMIN_SESSION_COOKIE = "admin_session";

/** Signed admin session lifetime (7 days). */
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const TEXT_INPUT_DEBOUNCE_MS = 400;
