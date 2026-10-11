"use client";

import { motion } from "motion/react";

import { Check, LoaderCircle } from "@/core/icons";

import "./c-field-status.scss";

export type FieldStatus = "idle" | "saving" | "saved";

type CFieldStatusProps = {
  status: FieldStatus;
  className?: string;
};

export function CFieldStatus({ status, className }: CFieldStatusProps) {
  if (status === "idle") {
    return (
      <span
        className={["c-field-status", className ?? ""].filter(Boolean).join(" ")}
        aria-hidden
      />
    );
  }

  const classes = ["c-field-status", className ?? ""].filter(Boolean).join(" ");

  return (
    <span className={classes} aria-live="polite">
      {status === "saving" ? (
        <span className="c-field-status__spinner" aria-label="Saving">
          <LoaderCircle size={18} strokeWidth={2.25} />
        </span>
      ) : (
        <motion.span
          className="c-field-status__check"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.18 }}
          aria-label="Saved"
        >
          <Check size={18} strokeWidth={2.25} />
        </motion.span>
      )}
    </span>
  );
}
