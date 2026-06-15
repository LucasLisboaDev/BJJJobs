import { Resend } from "resend";

let resend: Resend | null = null;

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? "BJJJobs <onboarding@resend.dev>";
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
