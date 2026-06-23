import { AlertCircle, CheckCircle, PartyPopper, XCircle } from "lucide-react";

export const APPLICATION_STATUSES = ["pending", "shortlisted", "rejected", "hired"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const STATUS_CONFIG: Record<
  string,
  { label: string; icon: typeof AlertCircle; color: string; bg: string }
> = {
  pending: { label: "Pending", icon: AlertCircle, color: "#92400e", bg: "#fef3c7" },
  shortlisted: { label: "Shortlisted", icon: CheckCircle, color: "#0F6E56", bg: "#E1F5EE" },
  rejected: { label: "Declined", icon: XCircle, color: "#991b1b", bg: "#fee2e2" },
  hired: { label: "Hired", icon: PartyPopper, color: "#1e40af", bg: "#dbeafe" },
};

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return APPLICATION_STATUSES.includes(value as ApplicationStatus);
}
