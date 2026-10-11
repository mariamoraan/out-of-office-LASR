"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, type ReactNode } from "react";

import { getDictionary } from "@/core/i18n";
import { X } from "@/core/icons";
import { CButton } from "@/design-system";

import "./dashboard-filters-sheet.scss";

type DashboardFiltersSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function DashboardFiltersSheet({
  open,
  onClose,
  children,
}: DashboardFiltersSheetProps) {
  const t = getDictionary("es");
  const filters = t.dashboard.list.filters;
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="f-dashboard-filters-sheet"
          key="filters-sheet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            className="f-dashboard-filters-sheet__backdrop"
            aria-label={filters.closeSheet}
            onClick={onClose}
          />
          <motion.div
            className="f-dashboard-filters-sheet__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
          >
            <header className="f-dashboard-filters-sheet__header">
              <h2 id={titleId} className="f-dashboard-filters-sheet__title">
                {filters.sectionLabel}
              </h2>
              <button
                ref={closeRef}
                type="button"
                className="f-dashboard-filters-sheet__close"
                onClick={onClose}
              >
                <X size={18} strokeWidth={1.75} aria-hidden />
                <span>{filters.closeSheet}</span>
              </button>
            </header>

            <div className="f-dashboard-filters-sheet__body">{children}</div>

            <footer className="f-dashboard-filters-sheet__footer">
              <CButton type="button" onClick={onClose}>
                {filters.doneSheet}
              </CButton>
            </footer>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
