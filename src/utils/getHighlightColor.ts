import { AtariRule } from "../types";

const GOLD_QUALITY_THRESHOLD = 5;
const GOLD_QUANTITY_THRESHOLD = 5;
const SILVER_QUALITY_THRESHOLD = 2;
const SILVER_QUANTITY_THRESHOLD = 3;

export type HighlightColor = "gold" | "silver" | "bronze" | null;

export const getHighlightColor = (rules: AtariRule[]): HighlightColor => {
  if (rules.length === 0) {
    return null;
  }

  const matchCount = rules.length;
  const maxPriority = Math.max(...rules.map((r) => r.priority), 0);

  if (maxPriority >= GOLD_QUALITY_THRESHOLD || matchCount >= GOLD_QUANTITY_THRESHOLD) {
    return "gold";
  }

  if (maxPriority >= SILVER_QUALITY_THRESHOLD || matchCount >= SILVER_QUANTITY_THRESHOLD) {
    return "silver";
  }

  return "bronze";
};
