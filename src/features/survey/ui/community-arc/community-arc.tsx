"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useMemo } from "react";

import {
  COMMUNITY_PORTRAITS,
  type CommunityPortrait,
} from "@/features/survey/ui/community-arc/community-portraits";

import "./community-arc.scss";

const ARC_DURATION_S = 40;
/**
 * Circle center sits below the stage so only a short crown (~130°) is visible.
 * Avatars still orbit a full circle under the clip.
 */
const VIEW_W = 360;
const VIEW_H = 128;
const AVATAR_RADIUS = 172;
/** Visible arc half-span from the crown (65° → ~130° total, under a semicircle). */
const VISIBLE_HALF_SPAN = (65 * Math.PI) / 180;
const CX = VIEW_W / 2;
const CY = VIEW_H + Math.sin(Math.PI / 2 - VISIBLE_HALF_SPAN) * AVATAR_RADIUS;
/** Orbit the asset list twice so more faces show with tighter spacing. */
const ORBIT_LOOPS = 2;

type CommunityArcProps = {
  className?: string;
};

type ArcAvatarProps = {
  portrait: CommunityPortrait;
  index: number;
  count: number;
  progress: MotionValue<number>;
  reduced: boolean;
};

function angleFromProgress(base: number, progress: number) {
  // Subtract progress so the visible crown drifts toward the right.
  return (base - progress) * Math.PI * 2;
}

function positionFromAngle(angle: number, radius: number) {
  return {
    x: CX + Math.cos(angle) * radius,
    y: CY - Math.sin(angle) * radius,
  };
}

function ArcAvatar({
  portrait,
  index,
  count,
  progress,
  reduced,
}: ArcAvatarProps) {
  const base = index / count;
  const angle = useTransform(progress, (p) => angleFromProgress(base, p));
  const left = useTransform(angle, (a) => {
    const { x } = positionFromAngle(a, AVATAR_RADIUS);
    return `${(x / VIEW_W) * 100}%`;
  });
  const top = useTransform(angle, (a) => {
    const { y } = positionFromAngle(a, AVATAR_RADIUS);
    return `${(y / VIEW_H) * 100}%`;
  });
  const scale = useTransform(angle, (a) => {
    const depth = Math.max(0, Math.sin(a));
    return 0.84 + depth * 0.24;
  });
  const zIndex = useTransform(angle, (a) => Math.round(Math.sin(a) * 24));
  const opacity = useTransform(angle, (a) => {
    // Soft dissolve near the visible crown edge (pairs with stage mask).
    const edge = Math.sin(a) - Math.sin(Math.PI / 2 - VISIBLE_HALF_SPAN);
    if (edge < 0.12) {
      return Math.max(0, edge / 0.12) * 0.55;
    }
    return 0.72 + Math.sin(a) * 0.28;
  });

  if (reduced) {
    // One pass of assets across the short crown (skip orbit duplicates).
    if (index >= COMMUNITY_PORTRAITS.length) {
      return null;
    }
    const staticCount = COMMUNITY_PORTRAITS.length;
    const t = index / Math.max(staticCount - 1, 1);
    const a =
      Math.PI / 2 -
      VISIBLE_HALF_SPAN +
      t * VISIBLE_HALF_SPAN * 2;
    const { x, y } = positionFromAngle(a, AVATAR_RADIUS);
    const depth = Math.sin(a);
    return (
      <span
        className="f-community-arc__avatar"
        style={{
          left: `${(x / VIEW_W) * 100}%`,
          top: `${(y / VIEW_H) * 100}%`,
          transform: `translate(-50%, -50%) scale(${0.84 + depth * 0.24})`,
          zIndex: Math.round(depth * 24),
          opacity: 0.62 + depth * 0.38,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static decorative asset */}
        <img src={portrait.src} alt="" draggable={false} />
      </span>
    );
  }

  return (
    <motion.span
      className="f-community-arc__avatar"
      style={{
        left,
        top,
        scale,
        zIndex,
        opacity,
        x: "-50%",
        y: "-50%",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static decorative asset */}
      <img src={portrait.src} alt="" draggable={false} />
    </motion.span>
  );
}

export function CommunityArc({ className }: CommunityArcProps) {
  const reduced = useReducedMotion() ?? false;
  const progress = useMotionValue(0);
  const classes = ["f-community-arc", className ?? ""].filter(Boolean).join(" ");

  const portraits = useMemo(
    () =>
      Array.from({ length: ORBIT_LOOPS }, () => COMMUNITY_PORTRAITS).flat(),
    [],
  );

  useEffect(() => {
    if (reduced) {
      progress.set(0);
      return;
    }

    const controls = animate(progress, 1, {
      duration: ARC_DURATION_S,
      ease: "linear",
      repeat: Infinity,
    });

    return () => controls.stop();
  }, [progress, reduced]);

  return (
    <div className={classes} aria-hidden>
      <div className="f-community-arc__stage">
        {portraits.map((portrait, index) => (
          <ArcAvatar
            key={`${portrait.src}-${index}`}
            portrait={portrait}
            index={index}
            count={portraits.length}
            progress={progress}
            reduced={reduced}
          />
        ))}
      </div>
    </div>
  );
}
