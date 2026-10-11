"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useMemo, type ReactNode } from "react";

import "./c-chip-group.scss";

type CChipGroupProps = {
  children: ReactNode;
  className?: string;
};

export function CChipGroup({ children, className }: CChipGroupProps) {
  const classes = ["c-chip-group", className ?? ""].filter(Boolean).join(" ");
  const reduced = useReducedMotion() ?? false;

  const groupVariants = useMemo<Variants>(
    () => ({
      initial: {},
      animate: {
        transition: {
          staggerChildren: reduced ? 0 : 0.04,
          delayChildren: reduced ? 0 : 0.03,
        },
      },
    }),
    [reduced],
  );

  return (
    <motion.div
      className={classes}
      variants={groupVariants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
}
