"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import "./c-chip.scss";

type CChipProps = {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function CChip({
  label,
  selected = false,
  icon,
  onClick,
  disabled = false,
  className,
}: CChipProps) {
  const classes = [
    "c-chip",
    selected ? "c-chip--selected" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 520, damping: 30 }}
    >
      {icon ? <span className="c-chip__icon">{icon}</span> : null}
      <span className="c-chip__label">{label}</span>
    </motion.button>
  );
}
