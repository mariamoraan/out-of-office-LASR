"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import {
  CFieldStatus,
  type FieldStatus,
} from "@/design-system/c-field-status/c-field-status";

import "./c-chip.scss";

type CChipProps = {
  label: string;
  selected?: boolean;
  status?: FieldStatus;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function CChip({
  label,
  selected = false,
  status = "idle",
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

  const trailingStatus: FieldStatus =
    status === "saving" ? "saving" : selected ? "saved" : "idle";

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
      {trailingStatus !== "idle" ? (
        <CFieldStatus status={trailingStatus} />
      ) : null}
    </motion.button>
  );
}
