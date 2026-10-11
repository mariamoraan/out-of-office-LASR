import { ADMIN_SESSION_MAX_AGE_SECONDS } from "@/core/constants/app.constants";
import { AdminAuthError } from "@/features/dashboard/domain/admin-auth-error";
import {
  readAdminCredentials,
  readAdminSessionSecret,
} from "@/features/dashboard/infrastructure/admin-env";
import {
  createAdminSessionExpiry,
  signAdminSessionToken,
} from "@/features/dashboard/infrastructure/admin-session-token";
import { safeStringEqual } from "@/features/dashboard/infrastructure/safe-string-equal";

export type LoginAdminInput = {
  username: string;
  password: string;
};

export type LoginAdminResult = {
  token: string;
  maxAgeSeconds: number;
};

export function loginAdmin(input: LoginAdminInput): LoginAdminResult {
  const credentials = readAdminCredentials();
  const secret = readAdminSessionSecret();

  if (!credentials || !secret) {
    throw new AdminAuthError(
      "ADMIN_AUTH_NOT_CONFIGURED",
      "Admin authentication is not configured.",
    );
  }

  const username = input.username.trim();
  const usernameMatches = safeStringEqual(username, credentials.username);
  const passwordMatches = safeStringEqual(input.password, credentials.password);

  if (!usernameMatches || !passwordMatches) {
    throw new AdminAuthError(
      "INVALID_CREDENTIALS",
      "Invalid username or password.",
    );
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const exp = createAdminSessionExpiry(
    ADMIN_SESSION_MAX_AGE_SECONDS,
    nowSeconds,
  );
  const token = signAdminSessionToken(
    { username: credentials.username, exp },
    secret,
  );

  return {
    token,
    maxAgeSeconds: ADMIN_SESSION_MAX_AGE_SECONDS,
  };
}
