import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const BELT_LABELS: Record<string, string> = {
  WHITE: "White belt",
  BLUE: "Blue belt",
  PURPLE: "Purple belt",
  BROWN: "Brown belt",
  BLACK: "Black belt",
};

export const BELT_COLORS: Record<string, string> = {
  WHITE: "#ccc",
  BLUE: "#3478c8",
  PURPLE: "#8b5cf6",
  BROWN: "#92400e",
  BLACK: "#1a1a1a",
};

export const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  REVENUE_SHARE: "Revenue share",
};

export function formatPay(min?: number, max?: number, type = "hourly"): string {
  if (!min && !max) return "Pay negotiable";
  const unit = type === "monthly" ? "/mo" : "/hr";
  if (min && max) return `$${min}–$${max}${unit}`;
  if (min) return `From $${min}${unit}`;
  return `Up to $${max}${unit}`;
}
