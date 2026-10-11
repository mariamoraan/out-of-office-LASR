"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

import { ChevronLeft } from "@/core/icons";
import { CProgress } from "@/design-system/c-progress/c-progress";

import "./c-step-shell.scss";

type CStepShellProps = {
  title: string;
  subtitle?: string;
  brand?: string;
  stepKey: string;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function CStepShell({
  title,
  subtitle,
  brand,
  stepKey,
  currentStep,
  totalSteps,
  onBack,
  footer,
  children,
  className,
}: CStepShellProps) {
  const classes = ["c-step-shell", className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <div className="c-step-shell__progress">
        <CProgress current={currentStep} total={totalSteps} />
      </div>

      <header className="c-step-shell__header">
        <div className="c-step-shell__top">
          {onBack ? (
            <button
              type="button"
              className="c-step-shell__back"
              onClick={onBack}
              aria-label="Volver"
            >
              <ChevronLeft size={22} strokeWidth={1.75} />
            </button>
          ) : (
            <span className="c-step-shell__back-spacer" aria-hidden />
          )}
          {brand ? <p className="c-step-shell__brand">{brand}</p> : <span />}
          <span className="c-step-shell__back-spacer" aria-hidden />
        </div>
      </header>

      <div className="c-step-shell__body">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepKey}
            className="c-step-shell__content"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="c-step-shell__title">{title}</h1>
            {subtitle ? (
              <p className="c-step-shell__subtitle">{subtitle}</p>
            ) : null}
            <div className="c-step-shell__main">{children}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {footer ? <footer className="c-step-shell__footer">{footer}</footer> : null}
    </div>
  );
}
