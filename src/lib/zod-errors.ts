import { z } from "zod";

const FIELD_LABELS: Record<string, string> = {
  firstName: "First name",
  lastName: "Last name",
  city: "City",
  state: "State",
  country: "Country",
  targetCity: "Target city",
  affiliation: "Affiliation",
  position: "Position",
  organization: "Gym / organization",
  description: "What you did",
  startDate: "Start date",
  endDate: "End date",
  reasonLeft: "Why you left",
  beltRank: "Belt rank",
  photoUrl: "Profile photo",
  resumeUrl: "Resume",
  instagram: "Instagram",
};

function labelForPath(path: (string | number)[]): string {
  const last = path[path.length - 1];
  if (typeof last === "number") {
    const parent = path[path.length - 2];
    const parentLabel =
      typeof parent === "string" ? FIELD_LABELS[parent] ?? parent : "Field";
    return `${parentLabel} (entry ${last + 1})`;
  }
  if (typeof last === "string") {
    return FIELD_LABELS[last] ?? last;
  }
  return "Field";
}

export function formatZodError(error: z.ZodError): string {
  const issue = error.errors[0];
  if (!issue) return "Please check your form and try again";

  const field = labelForPath(issue.path);

  if (issue.code === "invalid_type") {
    if (issue.received === "null" || issue.received === "undefined") {
      return `${field} is required`;
    }
    return `${field} has an invalid value`;
  }

  if (issue.message && !issue.message.startsWith("Expected")) {
    return issue.path.length > 0 ? `${field}: ${issue.message}` : issue.message;
  }

  if (issue.code === "too_small" && issue.type === "string") {
    return `${field} is required`;
  }

  return issue.path.length > 0 ? `${field} is invalid` : "Please check your form and try again";
}
