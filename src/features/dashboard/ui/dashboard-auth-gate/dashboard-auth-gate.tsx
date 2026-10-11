import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { appRoutes } from "@/core/routes/app.routes";
import { readAdminSession } from "@/features/dashboard/infrastructure/admin-session";

export async function DashboardAuthGate({
  children,
}: {
  children: ReactNode;
}) {
  const session = await readAdminSession();

  if (!session) {
    redirect(appRoutes.dashboardLogin);
  }

  return children;
}
