"use client";

import { motion } from "motion/react";

import "./c-progress.scss";

type CProgressProps = {
  current: number;
  total: number;
  /** Accessible name, e.g. "Paso 3 de 8". */
  label?: string;
  className?: string;
};

export function CProgress({
  current,
  total,
  label,
  className,
}: CProgressProps) {
  const safeTotal = Math.max(total, 1);
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal);
  const classes = ["c-progress", className ?? ""].filter(Boolean).join(" ");
  const valueText = label ?? `Paso ${safeCurrent} de ${safeTotal}`;

  return (
    <div
      className={classes}
      role="progressbar"
      aria-label={valueText}
      aria-valuemin={1}
      aria-valuemax={safeTotal}
      aria-valuenow={safeCurrent}
      aria-valuetext={valueText}
    >
      {Array.from({ length: safeTotal }, (_, index) => {
        const filled = index < safeCurrent;

        return (
          <div key={index} className="c-progress__segment">
            <motion.span
              className="c-progress__fill"
              initial={false}
              animate={{ scaleX: filled ? 1 : 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        );
      })}
    </div>
  );
}
