"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { Check } from "@/core/icons";

import "./c-option-row.scss";

type COptionRowProps = {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function COptionRow({
  label,
  selected = false,
  icon,
  onClick,
  disabled = false,
  className,
}: COptionRowProps) {
  const classes = [
    "c-option-row",
    selected ? "c-option-row--selected" : "",
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
      whileTap={disabled ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 520, damping: 32 }}
    >
      {icon ? <span className="c-option-row__icon">{icon}</span> : null}
      <span className="c-option-row__label">{label}</span>
      <span className="c-option-row__check" aria-hidden>
        {selected ? <Check size={18} strokeWidth={2.25} /> : null}
      </span>
    </motion.button>
  );
}
