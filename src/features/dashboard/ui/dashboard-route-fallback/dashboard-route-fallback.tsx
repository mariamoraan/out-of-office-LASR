import { getDictionary } from "@/core/i18n";
import { CLoader } from "@/design-system";

import "./dashboard-route-fallback.scss";

export function DashboardRouteFallback() {
  const t = getDictionary("es");

  return (
    <div className="f-dashboard-route-fallback">
      <CLoader label={t.common.loading} showLabel />
    </div>
  );
}
