import { AdminDashboardError } from "@/features/dashboard/domain/admin-dashboard-error";
import type { AdminSurveyWriteRepository } from "@/features/dashboard/domain/ports/admin-survey-write.repository";

type DeleteAdminSurveyResponsesDeps = {
  adminSurveyWriteRepository: AdminSurveyWriteRepository;
};

function normalizeIds(ids: string[]): string[] {
  const unique = new Set<string>();

  for (const id of ids) {
    const trimmed = id.trim();
    if (trimmed.length > 0) {
      unique.add(trimmed);
    }
  }

  return [...unique];
}

export async function deleteAdminSurveyResponses(
  ids: string[],
  deps: DeleteAdminSurveyResponsesDeps,
): Promise<{ deleted: number }> {
  const normalizedIds = normalizeIds(ids);

  if (normalizedIds.length === 0) {
    throw new AdminDashboardError(
      "INVALID_IDS",
      "At least one survey response id is required.",
    );
  }

  const deleted =
    await deps.adminSurveyWriteRepository.deleteByIds(normalizedIds);

  return { deleted };
}
