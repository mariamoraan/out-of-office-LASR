export type AdminCredentials = {
  username: string;
  password: string;
};

/**
 * Reads admin login credentials from env.
 * Returns null when either value is missing (auth must fail closed).
 */
export function readAdminCredentials(): AdminCredentials | null {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!username || password === undefined || password.length === 0) {
    return null;
  }

  return { username, password };
}

/**
 * Reads the secret used to sign admin session cookies.
 * Returns null when missing (auth must fail closed).
 */
export function readAdminSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!secret) {
    return null;
  }

  return secret;
}
