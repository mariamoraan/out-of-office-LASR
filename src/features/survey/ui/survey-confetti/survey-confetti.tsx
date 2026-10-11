"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import "./survey-confetti.scss";

const BRAND_COLORS = [
  "#c96142",
  "#a8482e",
  "#2b211c",
  "#fff9f4",
  "#e6d2c4",
  "#f0a070",
] as const;

type Particle = {
  id: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
  endRotate: number;
  color: string;
  xDrift: number;
  shape: "rect" | "square";
};

type SurveyConfettiProps = {
  className?: string;
};

function subscribe() {
  return () => {};
}

function useHasMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

function createParticles(count: number, burst: boolean): Particle[] {
  return Array.from({ length: count }, (_, index) => {
    const id = `${burst ? "b" : "f"}-${index}`;
    return {
      id,
      left: burst ? 35 + Math.random() * 30 : Math.random() * 100,
      delay: burst ? Math.random() * 0.15 : 0.4 + Math.random() * 1.2,
      duration: burst ? 1.1 + Math.random() * 0.5 : 2.4 + Math.random() * 1.6,
      size: burst ? 6 + Math.random() * 7 : 5 + Math.random() * 5,
      rotate: Math.random() * 360,
      endRotate: 240 + Math.random() * 180,
      color: BRAND_COLORS[index % BRAND_COLORS.length] ?? "#c96142",
      xDrift: (Math.random() - 0.5) * (burst ? 160 : 80),
      shape: Math.random() > 0.45 ? "rect" : "square",
    };
  });
}

export function SurveyConfetti({ className }: SurveyConfettiProps) {
  const reduced = useReducedMotion() ?? false;
  const hasMounted = useHasMounted();
  const [ended, setEnded] = useState(false);

  const particles = useMemo(() => {
    if (!hasMounted || reduced) {
      return [] as Particle[];
    }

    return [...createParticles(42, true), ...createParticles(28, false)];
  }, [hasMounted, reduced]);

  useEffect(() => {
    if (!hasMounted || reduced) {
      return;
    }

    const timer = window.setTimeout(() => setEnded(true), 5200);
    return () => window.clearTimeout(timer);
  }, [hasMounted, reduced]);

  const active = hasMounted && !reduced && !ended;

  if (!hasMounted || reduced || particles.length === 0) {
    return null;
  }

  const classes = ["f-survey-confetti", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} aria-hidden>
      <AnimatePresence>
        {active
          ? particles.map((particle) => (
              <motion.span
                key={particle.id}
                className={[
                  "f-survey-confetti__piece",
                  `f-survey-confetti__piece--${particle.shape}`,
                ].join(" ")}
                style={{
                  left: `${particle.left}%`,
                  width: particle.size,
                  height:
                    particle.shape === "rect"
                      ? particle.size * 0.45
                      : particle.size,
                  backgroundColor: particle.color,
                }}
                initial={{
                  opacity: 0,
                  y: -24,
                  x: 0,
                  rotate: particle.rotate,
                  scale: 0.6,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: ["0vh", "105vh"],
                  x: [0, particle.xDrift],
                  rotate: particle.rotate + particle.endRotate,
                  scale: 1,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: [0.22, 0.8, 0.36, 1],
                  opacity: {
                    duration: particle.duration,
                    times: [0, 0.08, 0.75, 1],
                  },
                }}
              />
            ))
          : null}
      </AnimatePresence>
    </div>
  );
}
