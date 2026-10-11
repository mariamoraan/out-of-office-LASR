"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

import "./c-button.scss";

type CButtonProps = {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  form?: string;
  variant?: "primary" | "ghost";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: HTMLMotionProps<"button">["onClick"];
};

export function CButton({
  children,
  type = "button",
  form,
  variant = "primary",
  disabled = false,
  fullWidth = true,
  className,
  onClick,
}: CButtonProps) {
  const classes = [
    "c-button",
    `c-button--${variant}`,
    fullWidth ? "c-button--full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.button
      className={classes}
      type={type}
      form={form}
      disabled={disabled}
      onClick={onClick}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 520, damping: 32 }}
    >
      {children}
    </motion.button>
  );
}
