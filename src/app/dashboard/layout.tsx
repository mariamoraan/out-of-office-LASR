import type { ReactNode } from "react";
import type { Metadata } from "next";

import { APP_NAME } from "@/core/constants/app.constants";

export const metadata: Metadata = {
  title: `Admin · ${APP_NAME}`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
