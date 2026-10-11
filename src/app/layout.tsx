import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DM_Serif_Display, Source_Sans_3 } from "next/font/google";

import { APP_NAME } from "@/core/constants/app.constants";

import "./globals.scss";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  variable: "--font-display-family",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-body-family",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    "Out Of Office LASR — teletrabajadores de producto digital en Los Angeles de San Rafael.",
};

const bodyFontVars = {
  "--font-display": "var(--font-display-family), serif",
  "--font-body": "var(--font-body-family), sans-serif",
} as CSSProperties;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${dmSerifDisplay.variable} ${sourceSans.variable}`}
      suppressHydrationWarning
    >
      <body style={bodyFontVars} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
