import type { Metadata } from "next";

import { APP_NAME } from "@/core/constants/app.constants";
import { getDictionary } from "@/core/i18n";
import { PrivacyPolicy } from "@/features/survey/ui/privacy-policy/privacy-policy";

const t = getDictionary("es");

export const metadata: Metadata = {
  title: `${t.privacy.title} · ${APP_NAME}`,
  description: t.privacy.intro,
};

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}
