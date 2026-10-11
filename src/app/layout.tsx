import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";

import { APP_NAME } from "@/core/constants/app.constants";

import "./globals.scss";

const fraunces = Fraunces({
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
    "Grupo de teletrabajadores en producto digital — Los Angeles de San Rafael.",
};

const bodyFontVars = {
  "--font-display": "var(--font-display-family), serif",
  "--font-body": "var(--font-body-family), sans-serif",
} as CSSProperties;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body style={bodyFontVars}>{children}</body>
    </html>
  );
}
