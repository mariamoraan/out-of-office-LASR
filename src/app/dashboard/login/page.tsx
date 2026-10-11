import { Suspense } from "react";

import { DashboardLoginGate } from "@/features/dashboard/ui/dashboard-login-gate/dashboard-login-gate";
import { DashboardRouteFallback } from "@/features/dashboard/ui/dashboard-route-fallback/dashboard-route-fallback";

export default function DashboardLoginPage() {
  return (
    <Suspense fallback={<DashboardRouteFallback />}>
      <DashboardLoginGate />
    </Suspense>
  );
}
