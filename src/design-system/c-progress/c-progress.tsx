"use client";

import { motion } from "motion/react";

import "./c-progress.scss";

type CProgressProps = {
  current: number;
  total: number;
  className?: string;
};

export function CProgress({ current, total, className }: CProgressProps) {
  const safeTotal = Math.max(total, 1);
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal);
  const classes = ["c-progress", className ?? ""].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={safeTotal}
      aria-valuenow={safeCurrent}
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
