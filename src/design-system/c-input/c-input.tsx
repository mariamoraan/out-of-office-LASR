"use client";

import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";

import "./c-input.scss";

type CInputProps = {
  id: string;
  label?: string;
  hint?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  name?: string;
  disabled?: boolean;
  className?: string;
};

export function CInput({
  id,
  label,
  hint,
  leading,
  trailing,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  name,
  disabled = false,
  className,
}: CInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const classes = ["c-input", className ?? ""].filter(Boolean).join(" ");

  return (
    <label className={classes} htmlFor={id}>
      {label ? <span className="c-input__label">{label}</span> : null}
      <span className="c-input__field">
        {leading ? <span className="c-input__leading">{leading}</span> : null}
        <input
          id={id}
          className="c-input__control"
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          disabled={disabled}
        />
        {trailing ? (
          <span className="c-input__trailing">{trailing}</span>
        ) : null}
      </span>
      {hint ? <span className="c-input__hint">{hint}</span> : null}
    </label>
  );
}
