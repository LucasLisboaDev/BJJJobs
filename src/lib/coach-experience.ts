import { NextResponse } from "next/server";

export type WorkExperienceInput = {
  position: string;
  organization: string;
  description: string;
  reasonLeft?: string;
  startDate: string;
  endDate?: string;
};

export function formatExperienceDates(startDate: string, endDate?: string | null) {
  const format = (value: string) => {
    const [year, month] = value.split("-");
    if (!year) return value;
    if (!month) return year;
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const start = format(startDate);
  const end = endDate ? format(endDate) : "Present";
  return `${start} – ${end}`;
}
