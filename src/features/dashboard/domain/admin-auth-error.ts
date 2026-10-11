export type AdminAuthErrorCode =
  | "ADMIN_AUTH_NOT_CONFIGURED"
  | "INVALID_CREDENTIALS"
  | "UNAUTHORIZED";

export class AdminAuthError extends Error {
  readonly code: AdminAuthErrorCode;

  constructor(code: AdminAuthErrorCode, message: string) {
    super(message);
    this.name = "AdminAuthError";
    this.code = code;
  }
}
