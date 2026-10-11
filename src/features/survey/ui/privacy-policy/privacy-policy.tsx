"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { getDictionary } from "@/core/i18n";
import { ArrowLeft } from "@/core/icons";
import { appRoutes } from "@/core/routes/app.routes";

import "./privacy-policy.scss";

export function PrivacyPolicy() {
  const t = getDictionary("es");
  const privacy = t.privacy;

  return (
    <main className="f-privacy">
      <div className="f-privacy__frame">
        <motion.header
          className="f-privacy__header"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link className="f-privacy__back" href={appRoutes.home}>
            <ArrowLeft size={18} strokeWidth={1.75} aria-hidden />
            <span>{privacy.backHome}</span>
          </Link>
          <p className="f-privacy__brand">{t.appName}</p>
          <h1 className="f-privacy__title">{privacy.title}</h1>
          <p className="f-privacy__meta">
            {privacy.updatedAtLabel}: {privacy.updatedAt}
          </p>
        </motion.header>

        <motion.div
          className="f-privacy__lead"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="f-privacy__intro">{privacy.intro}</p>
          <p className="f-privacy__disclaimer">{privacy.disclaimer}</p>
        </motion.div>

        <motion.div
          className="f-privacy__body"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.14,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {privacy.sections.map((section) => (
            <section key={section.title} className="f-privacy__section">
              <h2 className="f-privacy__section-title">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="f-privacy__paragraph">
                  {paragraph}
                </p>
              ))}
              {"bullets" in section && section.bullets ? (
                <ul className="f-privacy__list">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {"closing" in section && section.closing ? (
                <p className="f-privacy__paragraph">{section.closing}</p>
              ) : null}
            </section>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
