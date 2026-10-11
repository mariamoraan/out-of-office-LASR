"use client";

import { motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import "./c-tooltip.scss";

type CTooltipProps = {
  content: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
};

type TooltipCoords = {
  top: number;
  left: number;
  placement: "top" | "bottom";
};

const VIEWPORT_PADDING = 8;
const GAP = 8;

export function CTooltip({
  content,
  children,
  disabled = false,
  className,
}: CTooltipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<TooltipCoords | null>(null);
  const [mounted, setMounted] = useState(false);

  const canOpen = !disabled && content.trim().length > 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tip = tooltipRef.current;
    if (!trigger || !tip) {
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let placement: "top" | "bottom" = "top";
    let top = triggerRect.top - tipRect.height - GAP;

    if (top < VIEWPORT_PADDING) {
      placement = "bottom";
      top = triggerRect.bottom + GAP;
    }

    if (top + tipRect.height > viewportHeight - VIEWPORT_PADDING) {
      top = Math.max(
        VIEWPORT_PADDING,
        viewportHeight - VIEWPORT_PADDING - tipRect.height,
      );
    }

    let left = triggerRect.left + triggerRect.width / 2 - tipRect.width / 2;
    left = Math.min(
      Math.max(left, VIEWPORT_PADDING),
      viewportWidth - VIEWPORT_PADDING - tipRect.width,
    );

    setCoords({ top, left, placement });
  }, []);

  useLayoutEffect(() => {
    if (!open || !canOpen) {
      setCoords(null);
      return;
    }

    updatePosition();

    // Portal + motion can attach the bubble ref one frame later.
    const frame = window.requestAnimationFrame(() => {
      updatePosition();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, canOpen, content, updatePosition]);

  useEffect(() => {
    if (!open || !canOpen) {
      return;
    }

    const onReposition = () => updatePosition();
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);

    const trigger = triggerRef.current;
    const observer =
      trigger && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(onReposition)
        : null;
    if (trigger && observer) {
      observer.observe(trigger);
    }

    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
      observer?.disconnect();
    };
  }, [open, canOpen, updatePosition]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!canOpen && open) {
      setOpen(false);
    }
  }, [canOpen, open]);

  function show() {
    if (canOpen) {
      setOpen(true);
    }
  }

  function hide() {
    setOpen(false);
  }

  const classes = ["c-tooltip", className ?? ""].filter(Boolean).join(" ");
  const bubbleStyle: CSSProperties = coords
    ? { top: coords.top, left: coords.left }
    : { top: 0, left: 0, visibility: "hidden" };

  return (
    <span
      ref={triggerRef}
      className={classes}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      aria-describedby={open && canOpen ? tooltipId : undefined}
    >
      {children}
      {mounted && canOpen && open
        ? createPortal(
            <motion.span
              ref={tooltipRef}
              id={tooltipId}
              role="tooltip"
              className={[
                "c-tooltip__bubble",
                coords ? `c-tooltip__bubble--${coords.placement}` : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={bubbleStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: coords ? 1 : 0 }}
              transition={{ duration: 0.14 }}
            >
              {content}
            </motion.span>,
            document.body,
          )
        : null}
    </span>
  );
}
