import { redirect } from "next/navigation";

import { appRoutes } from "@/core/routes/app.routes";
import { readAdminSession } from "@/features/dashboard/infrastructure/admin-session";
import { DashboardLoginForm } from "@/features/dashboard/ui/dashboard-login-form/dashboard-login-form";

export async function DashboardLoginGate() {
  const session = await readAdminSession();

  if (session) {
    redirect(appRoutes.dashboard);
  }

  return <DashboardLoginForm />;
}
