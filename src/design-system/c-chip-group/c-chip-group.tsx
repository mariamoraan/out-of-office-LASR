import type { ReactNode } from "react";

import "./c-chip-group.scss";

type CChipGroupProps = {
  children: ReactNode;
  className?: string;
};

export function CChipGroup({ children, className }: CChipGroupProps) {
  const classes = ["c-chip-group", className ?? ""].filter(Boolean).join(" ");

  return <div className={classes}>{children}</div>;
}
