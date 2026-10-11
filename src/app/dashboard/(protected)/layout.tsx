import type { ReactNode } from "react";
import { Suspense } from "react";

import { DashboardAuthGate } from "@/features/dashboard/ui/dashboard-auth-gate/dashboard-auth-gate";
import { DashboardRouteFallback } from "@/features/dashboard/ui/dashboard-route-fallback/dashboard-route-fallback";

export default function DashboardProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardRouteFallback />}>
      <DashboardAuthGate>{children}</DashboardAuthGate>
    </Suspense>
  );
}
