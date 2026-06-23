export const APP_NAME = "JiuJitsuJobs";
export const APP_DOMAIN = "JiuJitsuJobs.com";

export const STORAGE_KEYS = {
  signupRole: "jiujitsujobs_signup_role",
  gymName: "jiujitsujobs_gym_name",
  locale: "jiujitsujobs_locale",
} as const;

/** @deprecated Pre-rebrand keys — read for one release, then remove */
const LEGACY_KEYS = {
  signupRole: "bjjjobs_signup_role",
  gymName: "bjjjobs_gym_name",
  locale: "bjjjobs_locale",
} as const;

export function readStored(key: keyof typeof STORAGE_KEYS): string | null {
  if (typeof window === "undefined") return null;
  return (
    sessionStorage.getItem(STORAGE_KEYS[key]) ??
    sessionStorage.getItem(LEGACY_KEYS[key])
  );
}
