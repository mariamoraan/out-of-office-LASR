"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { CTooltip } from "@/design-system";

type DashboardTruncatedCellProps = {
  value: string;
};

export function DashboardTruncatedCell({ value }: DashboardTruncatedCellProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element) {
      return;
    }

    const measure = () => {
      setTruncated(element.scrollWidth > element.clientWidth + 1);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);

    let cancelled = false;
    if (typeof document !== "undefined" && document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!cancelled) {
          measure();
        }
      });
    }

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [value]);

  return (
    <CTooltip
      content={value}
      disabled={!truncated}
      className="f-dashboard-responses__cell-tooltip"
    >
      <span ref={textRef} className="f-dashboard-responses__cell-text">
        {value}
      </span>
    </CTooltip>
  );
}
