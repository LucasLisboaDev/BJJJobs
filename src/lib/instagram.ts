import { z } from "zod";

const HANDLE_REGEX = /^[a-zA-Z0-9._]{1,30}$/;

export function normalizeInstagramHandle(input: string): string {
  const trimmed = input.trim();
  const urlMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)/i
  );
  if (urlMatch) return urlMatch[1];
  return trimmed.replace(/^@/, "");
}

export function instagramProfileUrl(handle: string): string {
  return `https://instagram.com/${handle}`;
}

export const optionalInstagramSchema = z
  .union([z.string(), z.literal("")])
  .optional()
  .transform((val) => {
    const trimmed = (val ?? "").trim();
    if (!trimmed) return undefined;
    return normalizeInstagramHandle(trimmed);
  })
  .refine((val) => val === undefined || HANDLE_REGEX.test(val), {
    message: "Enter a valid Instagram username",
  });
