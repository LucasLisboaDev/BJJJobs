export const WORK_AUTH_STATUSES = [
  "US_CITIZEN",
  "PERMANENT_RESIDENT",
  "AUTHORIZED_TO_WORK",
  "NEEDS_SPONSORSHIP",
  "NOT_AUTHORIZED",
  "PREFER_NOT_TO_SAY",
] as const;

export type WorkAuthorizationStatus = (typeof WORK_AUTH_STATUSES)[number];

export function coachHasUsWorkAuth(
  status: WorkAuthorizationStatus | string | null | undefined
): boolean {
  return (
    status === "US_CITIZEN" ||
    status === "PERMANENT_RESIDENT" ||
    status === "AUTHORIZED_TO_WORK"
  );
}

export function canCoachApplyToJob(
  _coachStatus: WorkAuthorizationStatus | string | null | undefined,
  _job: { workPermitRequired: boolean; sponsorshipAvailable: boolean }
): { allowed: boolean; reasonKey?: string } {
  // Work authorization is optional for coaches — never block applications based on it.
  return { allowed: true };
}

export function jobWorkAuthSummary(job: {
  workPermitRequired: boolean;
  sponsorshipAvailable: boolean;
}): string[] {
  const keys: string[] = [];
  if (job.workPermitRequired) keys.push("workAuth.jobPermitRequired");
  if (job.sponsorshipAvailable) keys.push("workAuth.jobSponsorshipAvailable");
  if (keys.length === 0) keys.push("workAuth.jobNotSpecified");
  return keys;
}
