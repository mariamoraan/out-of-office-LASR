"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useId, type KeyboardEvent, type MouseEvent, type Ref } from "react";

import { getDictionary } from "@/core/i18n";
import { Check } from "@/core/icons";
import { appRoutes } from "@/core/routes/app.routes";
import {
  CFieldStatus,
  type FieldStatus,
} from "@/design-system/c-field-status/c-field-status";

import "./survey-privacy-consent.scss";

type SurveyPrivacyConsentProps = {
  selected: boolean;
  status?: FieldStatus;
  invalid?: boolean;
  describedBy?: string;
  enterSubmitsFormId?: string;
  onToggle: () => void;
  ref?: Ref<HTMLButtonElement>;
};

export function SurveyPrivacyConsent({
  selected,
  status = "idle",
  invalid = false,
  describedBy,
  enterSubmitsFormId,
  onToggle,
  ref,
}: SurveyPrivacyConsentProps) {
  const t = getDictionary("es");
  const contact = t.survey.steps.contact;
  const labelId = useId();
  const trailingStatus: FieldStatus =
    status === "saving" ? "saving" : selected ? "saved" : "idle";

  const classes = [
    "f-survey-consent",
    selected ? "f-survey-consent--selected" : "",
    invalid ? "f-survey-consent--invalid" : "",
  ]
    .filter(Boolean)
    .join(" ");

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

  const handleCopyClick = (event: MouseEvent<HTMLParagraphElement>) => {
    if ((event.target as HTMLElement | null)?.closest("a")) {
      return;
    }

    onToggle();
  };

  return (
    <div className={classes}>
      <motion.button
        ref={ref}
        type="button"
        className="f-survey-consent__box-button"
        role="checkbox"
        aria-checked={selected}
        aria-labelledby={labelId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 520, damping: 32 }}
      >
        <span className="f-survey-consent__box" aria-hidden>
          <Check
            className="f-survey-consent__check"
            size={14}
            strokeWidth={2.75}
          />
        </span>
      </motion.button>

      <p
        id={labelId}
        className="f-survey-consent__copy"
        onClick={handleCopyClick}
      >
        {contact.consentBeforeLink}
        <Link
          className="f-survey-consent__link"
          href={appRoutes.privacy}
          target="_blank"
          rel="noopener noreferrer"
        >
          {contact.consentLink}
        </Link>
        {contact.consentAfterLink}
      </p>

      <CFieldStatus
        className="f-survey-consent__status"
        status={trailingStatus}
      />
    </div>
  );
}
