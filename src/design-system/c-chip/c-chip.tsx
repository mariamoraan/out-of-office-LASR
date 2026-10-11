"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useMemo, type KeyboardEvent, type ReactNode, type Ref } from "react";

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
  ref?: Ref<HTMLButtonElement>;
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
  ref,
}: CChipProps) {
  const classes = [
    "c-chip",
    selected ? "c-chip--selected" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  const reduced = useReducedMotion() ?? false;

  const enterVariants = useMemo<Variants>(
    () => ({
      initial: {
        opacity: 0,
        y: reduced ? 0 : 12,
        scale: reduced ? 1 : 0.92,
      },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: reduced ? 420 : 460,
          damping: reduced ? 36 : 24,
        },
      },
      exit: {
        opacity: 0,
        scale: reduced ? 1 : 0.9,
        transition: { duration: 0.16 },
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
    <motion.span
      className="c-chip__motion"
      variants={enterVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout={!reduced}
    >
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
        whileTap={disabled || reduced ? undefined : { scale: 0.94 }}
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
    </motion.span>
  );
}
