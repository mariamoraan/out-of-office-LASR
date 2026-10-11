"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

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
  titleId?: string;
  progressLabel?: string;
  backLabel?: string;
  onBack?: () => void;
  /** Called after the step content is ready; defaults to focusing the title. */
  onStepEnter?: () => void;
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
  titleId = "survey-step-title",
  progressLabel,
  backLabel = "Volver",
  onBack,
  onStepEnter,
  footer,
  children,
  className,
}: CStepShellProps) {
  const classes = ["c-step-shell", className ?? ""].filter(Boolean).join(" ");
  const titleRef = useRef<HTMLHeadingElement>(null);
  const onStepEnterRef = useRef(onStepEnter);
  onStepEnterRef.current = onStepEnter;

  const enterStep = () => {
    if (onStepEnterRef.current) {
      onStepEnterRef.current();
      return;
    }

    titleRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    // AnimatePresence mode="wait" mounts the next step after exit;
    // delay so the new step content exists.
    const timer = window.setTimeout(enterStep, 300);
    return () => window.clearTimeout(timer);
  }, [stepKey]);

  return (
    <main className={classes}>
      <div className="c-step-shell__progress">
        <CProgress
          current={currentStep}
          total={totalSteps}
          label={progressLabel}
        />
      </div>

      <header className="c-step-shell__header">
        <div className="c-step-shell__top">
          {onBack ? (
            <button
              type="button"
              className="c-step-shell__back"
              onClick={onBack}
              aria-label={backLabel}
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
            onAnimationComplete={enterStep}
          >
            <h1
              ref={titleRef}
              id={titleId}
              className="c-step-shell__title"
              tabIndex={-1}
            >
              {title}
            </h1>
            {subtitle ? (
              <p className="c-step-shell__subtitle">{subtitle}</p>
            ) : null}
            <div className="c-step-shell__main">{children}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {footer ? <footer className="c-step-shell__footer">{footer}</footer> : null}
    </main>
  );
}
