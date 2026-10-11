import { createElement, type ReactNode } from "react";

import type {
  Gender,
  LeisureTag,
  WorkArea,
} from "@/core/constants/survey.constants";
import {
  Briefcase,
  CircleHelp,
  Code2,
  Dumbbell,
  Footprints,
  Heart,
  LineChart,
  Mars,
  Mountain,
  Paintbrush,
  Palette,
  Rocket,
  Scissors,
  Server,
  Transgender,
  TreePine,
  TrendingUp,
  Utensils,
  Venus,
  Wine,
} from "@/core/icons";

function icon(Icon: typeof Code2) {
  return createElement(Icon, { size: 18, strokeWidth: 1.75 });
}

function chipIcon(Icon: typeof Code2) {
  return createElement(Icon, { size: 16, strokeWidth: 1.75 });
}

export const workAreaIcons: Record<WorkArea, ReactNode> = {
  engineering_development: icon(Code2),
  product_management: icon(Briefcase),
  ux_ui_design: icon(Palette),
  data_ai: icon(LineChart),
  marketing_growth: icon(TrendingUp),
  entrepreneurship_founders: icon(Rocket),
  qa_devops_systems: icon(Server),
  other_tech: icon(Briefcase),
};

export const leisureIcons: Record<LeisureTag, ReactNode> = {
  padel: chipIcon(Dumbbell),
  hiking: chipIcon(Mountain),
  sewing: chipIcon(Scissors),
  running: chipIcon(Footprints),
  yoga: chipIcon(Heart),
  wine: chipIcon(Wine),
  fine_dining: chipIcon(Utensils),
  museums: chipIcon(Palette),
  camping: chipIcon(TreePine),
  painting: chipIcon(Paintbrush),
};

export const genderIcons: Record<Gender, ReactNode> = {
  mujer: icon(Venus),
  hombre: icon(Mars),
  no_binario: icon(Transgender),
  prefiero_no_decirlo: icon(CircleHelp),
};
