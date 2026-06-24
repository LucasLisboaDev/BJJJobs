import { Resend } from "resend";
import { APP_NAME } from "@/lib/brand";

let resend: Resend | null = null;

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? `${APP_NAME} <onboarding@resend.dev>`;
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function getContactToEmail(): string {
  return process.env.CONTACT_TO_EMAIL ?? "lucaslisboalves@hotmail.com";
}
