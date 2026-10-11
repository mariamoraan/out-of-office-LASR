"use client";

import type {
  ChangeEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  Ref,
} from "react";

import {
  CFieldStatus,
  type FieldStatus,
} from "@/design-system/c-field-status/c-field-status";

import "./c-input.scss";

type CInputProps = {
  id: string;
  label?: string;
  hint?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  status?: FieldStatus;
  value: string;
  onChange: (value: string) => void;
  /** When set, Enter calls this and does not submit the parent form. */
  onEnter?: () => void;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  enterKeyHint?: InputHTMLAttributes<HTMLInputElement>["enterKeyHint"];
  name?: string;
  disabled?: boolean;
  className?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  ref?: Ref<HTMLInputElement>;
};

export function CInput({
  id,
  label,
  hint,
  leading,
  trailing,
  status = "idle",
  value,
  onChange,
  onEnter,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  enterKeyHint,
  name,
  disabled = false,
  className,
  ariaLabelledBy,
  ariaDescribedBy,
  ariaInvalid,
  ref,
}: CInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !onEnter) {
      return;
    }

    event.preventDefault();
    onEnter();
  };

  const classes = ["c-input", className ?? ""].filter(Boolean).join(" ");
  const showStatus = status !== "idle";
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy =
    [ariaDescribedBy, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <label className={classes} htmlFor={id}>
      {label ? <span className="c-input__label">{label}</span> : null}
      <span className="c-input__field">
        {leading ? (
          <span className="c-input__leading" aria-hidden>
            {leading}
          </span>
        ) : null}
        <input
          ref={ref}
          id={id}
          className="c-input__control"
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
          disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
          aria-invalid={ariaInvalid || undefined}
        />
        {showStatus ? (
          <span className="c-input__trailing">
            <CFieldStatus status={status} />
          </span>
        ) : trailing ? (
          <span className="c-input__trailing">{trailing}</span>
        ) : null}
      </span>
      {hint ? (
        <span id={hintId} className="c-input__hint">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
