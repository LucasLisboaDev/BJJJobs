import { z } from "zod";

export const COACH_LOCATION_TYPES = ["US", "INTERNATIONAL"] as const;
export type CoachLocationType = (typeof COACH_LOCATION_TYPES)[number];

export type CoachLocationInput = {
  locationType: CoachLocationType;
  city: string;
  state: string;
  country: string;
};

export type CoachLocationData = {
  locationType?: CoachLocationType | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
};

export const emptyCoachLocation = (): CoachLocationInput => ({
  locationType: "US",
  city: "",
  state: "",
  country: "",
});

export const coachLocationSchema = z
  .object({
    locationType: z.enum(COACH_LOCATION_TYPES),
    city: z.string().trim().min(1),
    state: z.string().trim().min(1),
    country: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.locationType === "INTERNATIONAL" && !data.country) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Country is required",
        path: ["country"],
      });
    }
  });

export function coachLocationFromData(data: CoachLocationData): CoachLocationInput {
  return {
    locationType: data.locationType ?? (data.country ? "INTERNATIONAL" : "US"),
    city: data.city ?? "",
    state: data.state ?? "",
    country: data.country ?? "",
  };
}

export function formatCoachLocation(data: CoachLocationData): string | null {
  const { city, state, country, locationType } = data;
  if (!city && !state && !country) return null;

  const isInternational =
    locationType === "INTERNATIONAL" || (!locationType && !!country && !isUsStateAbbr(state));

  if (isInternational) {
    const parts = [city, state, country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
  }

  if (city && state) return `${city}, ${state}`;
  return city || state || country || null;
}

function isUsStateAbbr(value?: string | null) {
  if (!value || value.length !== 2) return false;
  return /^[A-Z]{2}$/.test(value);
}

export function validateCoachLocation(
  location: CoachLocationInput,
  messages: { us: string; international: string }
): string | null {
  const result = coachLocationSchema.safeParse({
    ...location,
    country: location.locationType === "US" ? undefined : location.country,
  });

  if (result.success) return null;
  return location.locationType === "US" ? messages.us : messages.international;
}

export function coachLocationToPayload(location: CoachLocationInput) {
  return {
    locationType: location.locationType,
    city: location.city.trim(),
    state: location.state.trim(),
    country: location.locationType === "INTERNATIONAL" ? location.country.trim() : null,
  };
}
