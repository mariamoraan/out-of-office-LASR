"use client";

import { motion } from "motion/react";

import "./c-loader.scss";

type CLoaderProps = {
  label?: string;
  className?: string;
};

export function CLoader({ label, className }: CLoaderProps) {
  const classes = ["c-loader", className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={classes} role="status" aria-live="polite" aria-busy="true">
      <div className="c-loader__mark" aria-hidden>
        <motion.span
          className="c-loader__glow"
          animate={{
            scale: [0.92, 1.08, 0.92],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: 1.8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <div className="c-loader__orbit">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="c-loader__dot"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.15, 1],
                opacity: [0.45, 1, 0.45],
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
                repeat: Infinity,
                delay: index * 0.14,
              }}
            />
          ))}
        </div>
      </div>

      <div className="c-loader__bar" aria-hidden>
        <motion.span
          className="c-loader__bar-fill"
          animate={{ x: ["-40%", "120%"] }}
          transition={{
            duration: 1.25,
            ease: [0.4, 0, 0.2, 1],
            repeat: Infinity,
          }}
        />
      </div>

      {label ? <p className="c-loader__label">{label}</p> : null}
      <span className="c-loader__sr-only">Loading</span>
    </div>
  );
}
