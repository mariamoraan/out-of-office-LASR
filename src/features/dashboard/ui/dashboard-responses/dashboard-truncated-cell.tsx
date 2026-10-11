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

    return () => observer.disconnect();
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
