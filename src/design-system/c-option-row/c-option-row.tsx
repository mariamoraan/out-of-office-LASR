"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useMemo, type KeyboardEvent, type ReactNode, type Ref } from "react";

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
  ref?: Ref<HTMLButtonElement>;
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
  ref,
}: COptionRowProps) {
  const classes = [
    "c-option-row",
    selected ? "c-option-row--selected" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  const reduced = useReducedMotion() ?? false;

  const enterVariants = useMemo<Variants>(
    () => ({
      initial: {
        opacity: 0,
        y: reduced ? 0 : 14,
        x: reduced ? 0 : 8,
      },
      animate: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          type: "spring",
          stiffness: reduced ? 400 : 420,
          damping: reduced ? 34 : 26,
        },
      },
    }),
    [reduced],
  );

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
    <motion.div className="c-option-row__motion" variants={enterVariants}>
      <motion.button
        ref={ref}
        type="button"
        className={classes}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        tabIndex={tabIndex}
        role={selection}
        aria-checked={selection ? selected : undefined}
        aria-pressed={selection ? undefined : selected}
        whileTap={disabled || reduced ? undefined : { scale: 0.985 }}
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
    </motion.div>
  );
}
