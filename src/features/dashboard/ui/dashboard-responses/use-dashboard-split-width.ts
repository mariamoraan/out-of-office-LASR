"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

export const DASHBOARD_FILTERS_WIDTH_STORAGE_KEY =
  "la-dashboard-filters-width-px";

export const DASHBOARD_FILTERS_DEFAULT_WIDTH_PX = 336;
export const DASHBOARD_FILTERS_MIN_WIDTH_PX = 256;
export const DASHBOARD_FILTERS_MAX_RATIO = 0.45;
export const DASHBOARD_FILTERS_KEYBOARD_STEP_PX = 16;

function readStoredWidth(): number | null {
  try {
    const raw = window.localStorage.getItem(
      DASHBOARD_FILTERS_WIDTH_STORAGE_KEY,
    );
    if (!raw) {
      return null;
    }

    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function persistWidth(widthPx: number) {
  try {
    window.localStorage.setItem(
      DASHBOARD_FILTERS_WIDTH_STORAGE_KEY,
      String(widthPx),
    );
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export function useDashboardSplitWidth() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [widthPx, setWidthPx] = useState(DASHBOARD_FILTERS_DEFAULT_WIDTH_PX);
  const [dragging, setDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(DASHBOARD_FILTERS_DEFAULT_WIDTH_PX);

  const clampWidth = useCallback((next: number) => {
    const bodyWidth = bodyRef.current?.clientWidth ?? 0;
    const maxFromRatio =
      bodyWidth > 0
        ? Math.floor(bodyWidth * DASHBOARD_FILTERS_MAX_RATIO)
        : Number.POSITIVE_INFINITY;
    const maxWidth = Math.max(DASHBOARD_FILTERS_MIN_WIDTH_PX, maxFromRatio);

    return Math.min(
      Math.max(next, DASHBOARD_FILTERS_MIN_WIDTH_PX),
      maxWidth,
    );
  }, []);

  useEffect(() => {
    const stored = readStoredWidth();
    if (stored === null) {
      return;
    }

    setWidthPx(clampWidth(stored));
  }, [clampWidth]);

  useEffect(() => {
    if (!dragging) {
      return;
    }

    const previousUserSelect = document.body.style.userSelect;
    const previousCursor = document.body.style.cursor;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    const onPointerMove = (event: PointerEvent) => {
      const delta = event.clientX - dragStartXRef.current;
      setWidthPx(clampWidth(dragStartWidthRef.current + delta));
    };

    const onPointerUp = () => {
      setDragging(false);
      setWidthPx((current) => {
        const clamped = clampWidth(current);
        persistWidth(clamped);
        return clamped;
      });
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      document.body.style.userSelect = previousUserSelect;
      document.body.style.cursor = previousCursor;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragging, clampWidth]);

  const onDividerPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) {
        return;
      }

      dragStartXRef.current = event.clientX;
      dragStartWidthRef.current = widthPx;
      event.preventDefault();
      setDragging(true);
    },
    [widthPx],
  );

  const onDividerKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const delta =
          event.key === "ArrowLeft"
            ? -DASHBOARD_FILTERS_KEYBOARD_STEP_PX
            : DASHBOARD_FILTERS_KEYBOARD_STEP_PX;

        setWidthPx((current) => {
          const next = clampWidth(current + delta);
          persistWidth(next);
          return next;
        });
      }

      if (event.key === "Home") {
        event.preventDefault();
        setWidthPx(() => {
          const next = clampWidth(DASHBOARD_FILTERS_MIN_WIDTH_PX);
          persistWidth(next);
          return next;
        });
      }

      if (event.key === "End") {
        event.preventDefault();
        setWidthPx(() => {
          const bodyWidth = bodyRef.current?.clientWidth ?? 0;
          const next = clampWidth(
            Math.floor(bodyWidth * DASHBOARD_FILTERS_MAX_RATIO),
          );
          persistWidth(next);
          return next;
        });
      }
    },
    [clampWidth],
  );

  const maxWidthPx = (() => {
    const bodyWidth = bodyRef.current?.clientWidth ?? 0;
    if (bodyWidth <= 0) {
      return DASHBOARD_FILTERS_DEFAULT_WIDTH_PX;
    }

    return Math.max(
      DASHBOARD_FILTERS_MIN_WIDTH_PX,
      Math.floor(bodyWidth * DASHBOARD_FILTERS_MAX_RATIO),
    );
  })();

  return {
    bodyRef,
    widthPx,
    dragging,
    minWidthPx: DASHBOARD_FILTERS_MIN_WIDTH_PX,
    maxWidthPx,
    onDividerPointerDown,
    onDividerKeyDown,
  };
}
