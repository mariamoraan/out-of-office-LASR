"use client";

import { motion } from "motion/react";
import type { KeyboardEvent, ReactNode } from "react";

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
  /** checkbox for multi-select APG; omit for toggle button. */
  selection?: "checkbox";
  tabIndex?: number;
  /** When set, Enter submits this form instead of activating the chip. */
  enterSubmitsFormId?: string;
};

export function CChip({
  label,
  selected = false,
  status = "idle",
  icon,
  onClick,
  disabled = false,
  className,
  selection,
  tabIndex,
  enterSubmitsFormId,
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

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" || !enterSubmitsFormId) {
      return;
    }

    event.preventDefault();
    const form = document.getElementById(enterSubmitsFormId);
    if (form instanceof HTMLFormElement) {
      form.requestSubmit();
    }
  };

  return (
    <motion.button
      type="button"
      className={classes}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      tabIndex={tabIndex}
      role={selection}
      aria-checked={selection ? selected : undefined}
      aria-pressed={selection ? undefined : selected}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 520, damping: 30 }}
    >
      {icon ? (
        <span className="c-chip__icon" aria-hidden>
          {icon}
        </span>
      ) : null}
      <span className="c-chip__label">{label}</span>
      {trailingStatus !== "idle" ? (
        <CFieldStatus
          className="c-chip__status"
          status={trailingStatus}
        />
      ) : null}
    </motion.button>
  );
}
