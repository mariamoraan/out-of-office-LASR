"use client";

import { motion } from "motion/react";
import type { KeyboardEvent, ReactNode } from "react";

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
  /** radio | checkbox for APG selection; omit for toggle button. */
  selection?: "radio" | "checkbox";
  tabIndex?: number;
  /** When set, Enter submits this form instead of activating the row. */
  enterSubmitsFormId?: string;
};

export function COptionRow({
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
      whileTap={disabled ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 520, damping: 32 }}
    >
      {icon ? (
        <span className="c-option-row__icon" aria-hidden>
          {icon}
        </span>
      ) : null}
      <span className="c-option-row__label">{label}</span>
      <CFieldStatus
        className="c-option-row__status"
        status={trailingStatus}
      />
    </motion.button>
  );
}
