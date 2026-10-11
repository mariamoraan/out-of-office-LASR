"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef } from "react";

import { LEISURE_TAGS, type LeisureTag } from "@/core/constants/survey.constants";
import { getDictionary } from "@/core/i18n";
import { X } from "@/core/icons";
import type { AdminSurveyResponseDto } from "@/features/dashboard/infrastructure/admin-survey-response.dto";

import "./dashboard-response-detail-panel.scss";

type DashboardResponseDetailPanelProps = {
  response: AdminSurveyResponseDto | null;
  onClose: () => void;
};

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
  timeStyle: "short",
});

const leisureTagSet = new Set<string>(LEISURE_TAGS);

function formatDateValue(value: string | null, empty: string): string {
  if (!value) {
    return empty;
  }

  return dateFormatter.format(new Date(value));
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="f-dashboard-detail__row">
      <dt className="f-dashboard-detail__label">{label}</dt>
      <dd className="f-dashboard-detail__value">{value}</dd>
    </div>
  );
}

export function DashboardResponseDetailPanel({
  response,
  onClose,
}: DashboardResponseDetailPanelProps) {
  const t = getDictionary("es");
  const detail = t.dashboard.detail;
  const list = t.dashboard.list;
  const labels = t.survey.labels;
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!response) {
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
  }, [response, onClose]);

  function leisureLabel(tag: string): string {
    if (leisureTagSet.has(tag)) {
      return labels.leisure[tag as LeisureTag];
    }

    return tag;
  }

  return (
    <AnimatePresence>
      {response ? (
        <motion.div
          className="f-dashboard-detail"
          key={response.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            className="f-dashboard-detail__backdrop"
            aria-label={detail.close}
            onClick={onClose}
          />
          <motion.aside
            className="f-dashboard-detail__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
          >
            <header className="f-dashboard-detail__header">
              <h2 id={titleId} className="f-dashboard-detail__title">
                {detail.title}
              </h2>
              <button
                ref={closeRef}
                type="button"
                className="f-dashboard-detail__close"
                onClick={onClose}
              >
                <X size={18} strokeWidth={1.75} aria-hidden />
                <span>{detail.close}</span>
              </button>
            </header>

            <dl className="f-dashboard-detail__list">
              <DetailRow
                label={detail.fields.status}
                value={list.status[response.status]}
              />
              <DetailRow
                label={detail.fields.name}
                value={response.fullName ?? list.emptyCell}
              />
              <DetailRow
                label={detail.fields.age}
                value={
                  response.ageGroup
                    ? labels.ageGroups[response.ageGroup]
                    : list.emptyCell
                }
              />
              <DetailRow
                label={detail.fields.email}
                value={response.email ?? list.emptyCell}
              />
              <DetailRow
                label={detail.fields.whatsapp}
                value={response.whatsapp ?? list.emptyCell}
              />
              <DetailRow
                label={detail.fields.privacyConsentAcceptedAt}
                value={formatDateValue(
                  response.privacyConsentAcceptedAt,
                  list.emptyCell,
                )}
              />
              <DetailRow
                label={detail.fields.linkedin}
                value={response.linkedin ?? list.emptyCell}
              />
              <DetailRow
                label={detail.fields.instagram}
                value={response.instagram ?? list.emptyCell}
              />
              <DetailRow
                label={detail.fields.x}
                value={response.xHandle ?? list.emptyCell}
              />
              <DetailRow
                label={detail.fields.work}
                value={
                  response.workAreas.length > 0
                    ? response.workAreas
                        .map((area) => labels.workAreas[area])
                        .join(" · ")
                    : list.emptyCell
                }
              />
              <DetailRow
                label={detail.fields.workOther}
                value={response.workAreaOther ?? list.emptyCell}
              />
              <DetailRow
                label={detail.fields.leisure}
                value={
                  response.leisureTags.length > 0
                    ? response.leisureTags.map(leisureLabel).join(" · ")
                    : list.emptyCell
                }
              />
              <DetailRow
                label={detail.fields.leisureOther}
                value={
                  response.leisureOther.length > 0
                    ? response.leisureOther.join(" · ")
                    : list.emptyCell
                }
              />
              <DetailRow
                label={detail.fields.gender}
                value={
                  response.gender
                    ? labels.genders[response.gender]
                    : list.emptyCell
                }
              />
              <DetailRow
                label={detail.fields.meeting}
                value={
                  response.meetingSlots.length > 0
                    ? response.meetingSlots
                        .map((slot) => labels.meetingSlots[slot])
                        .join(" · ")
                    : list.emptyCell
                }
              />
              <DetailRow
                label={detail.fields.createdAt}
                value={formatDateValue(response.createdAt, list.emptyCell)}
              />
              <DetailRow
                label={detail.fields.updatedAt}
                value={formatDateValue(response.updatedAt, list.emptyCell)}
              />
              <DetailRow
                label={detail.fields.submittedAt}
                value={formatDateValue(response.submittedAt, list.emptyCell)}
              />
              <DetailRow label={detail.fields.id} value={response.id} />
            </dl>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
