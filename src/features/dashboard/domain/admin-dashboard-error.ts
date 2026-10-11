export type AdminDashboardErrorCode = "RESPONSE_NOT_FOUND" | "INVALID_IDS";

export class AdminDashboardError extends Error {
  readonly code: AdminDashboardErrorCode;

  constructor(code: AdminDashboardErrorCode, message: string) {
    super(message);
    this.name = "AdminDashboardError";
    this.code = code;
  }
}
