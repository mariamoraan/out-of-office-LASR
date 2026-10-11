"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useMemo, type KeyboardEvent, type ReactNode } from "react";

import "./c-choice-group.scss";

type CChoiceGroupProps = {
  /** Element id that labels this group (typically the step title). */
  labelledBy: string;
  mode: "single" | "multi";
  children: ReactNode;
  className?: string;
};

function moveRadioFocus(
  container: HTMLElement,
  key: string,
) {
  const radios = Array.from(
    container.querySelectorAll<HTMLElement>('[role="radio"]:not(:disabled)'),
  );

  if (radios.length === 0) {
    return;
  }

  const currentIndex = radios.findIndex(
    (element) => element === document.activeElement,
  );

  let nextIndex = currentIndex;

  if (key === "ArrowDown" || key === "ArrowRight") {
    nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % radios.length;
  } else if (key === "ArrowUp" || key === "ArrowLeft") {
    nextIndex =
      currentIndex < 0
        ? radios.length - 1
        : (currentIndex - 1 + radios.length) % radios.length;
  } else if (key === "Home") {
    nextIndex = 0;
  } else if (key === "End") {
    nextIndex = radios.length - 1;
  } else {
    return;
  }

  const next = radios[nextIndex];
  next?.focus();
  next?.click();
}

export function CChoiceGroup({
  labelledBy,
  mode,
  children,
  className,
}: CChoiceGroupProps) {
  const classes = ["c-choice-group", className ?? ""].filter(Boolean).join(" ");
  const reduced = useReducedMotion() ?? false;

  const groupVariants = useMemo<Variants>(
    () => ({
      initial: {},
      animate: {
        transition: {
          staggerChildren: reduced ? 0 : 0.045,
          delayChildren: reduced ? 0 : 0.04,
        },
      },
    }),
    [reduced],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (mode !== "single") {
      return;
    }

    if (
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp" &&
      event.key !== "ArrowRight" &&
      event.key !== "ArrowLeft" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }

    event.preventDefault();
    moveRadioFocus(event.currentTarget, event.key);
  };

  return (
    <motion.div
      className={classes}
      role={mode === "single" ? "radiogroup" : "group"}
      aria-labelledby={labelledBy}
      onKeyDown={handleKeyDown}
      variants={groupVariants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
}
