"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import {
  CFieldStatus,
  type FieldStatus,
} from "@/design-system/c-field-status/c-field-status";

import "./c-option-row.scss";

type COptionRowProps = {
  label: string;
  selected?: boolean;
  status?: FieldStatus;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function COptionRow({
  label,
  selected = false,
  status = "idle",
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

  const trailingStatus: FieldStatus =
    status === "saving" ? "saving" : selected ? "saved" : "idle";

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
      <CFieldStatus status={trailingStatus} />
    </motion.button>
  );
}
