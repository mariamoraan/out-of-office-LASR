"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { getDictionary } from "@/core/i18n";
import { appRoutes } from "@/core/routes/app.routes";
import {
  DashboardApiError,
  loginAdminRequest,
} from "@/features/dashboard/ui/dashboard-api-client";
import { CButton, CInput } from "@/design-system";

import "./dashboard-login-form.scss";

function resolveLoginErrorMessage(error: unknown): string {
  const t = getDictionary("es").dashboard.login.errors;

  if (error instanceof DashboardApiError) {
    if (error.code === "INVALID_CREDENTIALS") {
      return t.invalidCredentials;
    }
    if (error.code === "ADMIN_AUTH_NOT_CONFIGURED") {
      return t.notConfigured;
    }
  }

  return t.generic;
}

export function DashboardLoginForm() {
  const t = getDictionary("es");
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const canSubmit = username.trim().length > 0 && password.length > 0 && !pending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setPending(true);
    setError(null);

    try {
      await loginAdminRequest({ username, password });
      router.replace(appRoutes.dashboard);
      router.refresh();
    } catch (submitError) {
      setError(resolveLoginErrorMessage(submitError));
      setPending(false);
    }
  }

  return (
    <main className="f-dashboard-login">
      <motion.div
        className="f-dashboard-login__panel"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
      >
        <p className="f-dashboard-login__brand">{t.appName}</p>
        <h1 className="f-dashboard-login__title">{t.dashboard.login.title}</h1>
        <p className="f-dashboard-login__subtitle">
          {t.dashboard.login.subtitle}
        </p>

        <form className="f-dashboard-login__form" onSubmit={handleSubmit}>
          <CInput
            id="admin-username"
            name="username"
            label={t.dashboard.login.usernameLabel}
            value={username}
            onChange={setUsername}
            autoComplete="username"
            disabled={pending}
            ariaInvalid={Boolean(error)}
          />
          <CInput
            id="admin-password"
            name="password"
            type="password"
            label={t.dashboard.login.passwordLabel}
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            disabled={pending}
            ariaInvalid={Boolean(error)}
          />

          {error ? (
            <p className="f-dashboard-login__error" role="alert">
              {error}
            </p>
          ) : null}

          <CButton type="submit" disabled={!canSubmit}>
            {pending
              ? t.dashboard.login.submitting
              : t.dashboard.login.submit}
          </CButton>
        </form>
      </motion.div>
    </main>
  );
}
