import { createElement, type ReactNode } from "react";

import type {
  Gender,
  LeisureTag,
  WorkArea,
} from "@/core/constants/survey.constants";
import {
  Bike,
  BookOpen,
  Briefcase,
  Camera,
  ChefHat,
  CircleHelp,
  Clapperboard,
  Code2,
  Dice5,
  Dumbbell,
  Footprints,
  Gamepad2,
  Heart,
  LineChart,
  Mars,
  Mountain,
  Music,
  Paintbrush,
  Palette,
  PartyPopper,
  Plane,
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
  reading: chipIcon(BookOpen),
  cinema: chipIcon(Clapperboard),
  music: chipIcon(Music),
  cycling: chipIcon(Bike),
  photography: chipIcon(Camera),
  board_games: chipIcon(Dice5),
  cooking: chipIcon(ChefHat),
  travel: chipIcon(Plane),
  dancing: chipIcon(PartyPopper),
  video_games: chipIcon(Gamepad2),
};

export const genderIcons: Record<Gender, ReactNode> = {
  mujer: icon(Venus),
  hombre: icon(Mars),
  no_binario: icon(Transgender),
  prefiero_no_decirlo: icon(CircleHelp),
};
