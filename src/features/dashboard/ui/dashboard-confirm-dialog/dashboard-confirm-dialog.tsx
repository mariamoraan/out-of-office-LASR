"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef } from "react";

import { CButton } from "@/design-system";

import "./dashboard-confirm-dialog.scss";

type DashboardConfirmDialogProps = {
  open: boolean;
  title: string;
  body: string;
  cancelLabel: string;
  confirmLabel: string;
  confirmingLabel: string;
  confirming?: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DashboardConfirmDialog({
  open,
  title,
  body,
  cancelLabel,
  confirmLabel,
  confirmingLabel,
  confirming = false,
  error = null,
  onCancel,
  onConfirm,
}: DashboardConfirmDialogProps) {
  const titleId = useId();
  const bodyId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !confirming) {
        onCancel();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    cancelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, confirming, onCancel]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="f-dashboard-confirm-dialog"
          key="confirm-dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <button
            type="button"
            className="f-dashboard-confirm-dialog__backdrop"
            aria-label={cancelLabel}
            disabled={confirming}
            onClick={() => {
              if (!confirming) {
                onCancel();
              }
            }}
          />
          <motion.div
            className="f-dashboard-confirm-dialog__panel"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={bodyId}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <h2 id={titleId} className="f-dashboard-confirm-dialog__title">
              {title}
            </h2>
            <p id={bodyId} className="f-dashboard-confirm-dialog__body">
              {body}
            </p>
            {error ? (
              <p className="f-dashboard-confirm-dialog__error" role="alert">
                {error}
              </p>
            ) : null}
            <div className="f-dashboard-confirm-dialog__actions">
              <CButton
                ref={cancelRef}
                type="button"
                variant="ghost"
                fullWidth={false}
                disabled={confirming}
                className="f-dashboard-confirm-dialog__cancel"
                onClick={onCancel}
              >
                {cancelLabel}
              </CButton>
              <CButton
                type="button"
                fullWidth={false}
                disabled={confirming}
                className="f-dashboard-confirm-dialog__confirm"
                onClick={onConfirm}
              >
                {confirming ? confirmingLabel : confirmLabel}
              </CButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
