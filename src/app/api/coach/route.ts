import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncClerkEmail } from "@/lib/email/get-user-email";
import { optionalInstagramSchema } from "@/lib/instagram";
import { WORK_AUTH_STATUSES } from "@/lib/work-authorization";
import { coachLocationSchema, coachLocationToPayload } from "@/lib/coach-location";
import { formatZodError } from "@/lib/zod-errors";
import { z } from "zod";

const experienceSchema = z
  .object({
    position: z.string().min(1, "Position is required"),
    organization: z.string().min(1, "Gym / organization is required"),
    description: z.string().min(1, "Description is required"),
    reasonLeft: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    isCurrent: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isCurrent && !data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date is required (or check \"I currently work here\")",
        path: ["endDate"],
      });
    }
  });

const coachSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    photoUrl: z.string().optional(),
    beltRank: z.enum(["WHITE", "BLUE", "PURPLE", "BROWN", "BLACK"]),
    affiliation: z.string().optional(),
    yearsTeaching: z.number().min(0).default(0),
    specialties: z.array(z.string()).default([]),
    targetCity: z.string().optional(),
    locationType: z.enum(["US", "INTERNATIONAL"]),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().nullable().optional(),
    bio: z.string().optional(),
    minPay: z.number().optional(),
    maxPay: z.number().optional(),
    resumeUrl: z.string().optional(),
    resumeFileName: z.string().optional(),
    instagram: optionalInstagramSchema,
    workAuthorizationStatus: z.enum(WORK_AUTH_STATUSES).optional(),
    experiences: z.array(experienceSchema).default([]),
  })
  .refine((data) => data.resumeUrl || data.experiences.length > 0, {
    message: "Upload a resume or add at least one work experience entry",
    path: ["experiences"],
  })
  .superRefine((data, ctx) => {
    const locationResult = coachLocationSchema.safeParse({
      locationType: data.locationType,
      city: data.city,
      state: data.state,
      country: data.country,
    });
    if (!locationResult.success) {
      locationResult.error.issues.forEach((issue) => ctx.addIssue(issue));
    }
  });

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = coachSchema.parse(body);
    const { experiences, country, locationType, city, state, ...rest } = parsed;
    const locationPayload = coachLocationToPayload({
      locationType,
      city,
      state,
      country: country ?? "",
    });
    const data = { ...rest, ...locationPayload };

    const email = await syncClerkEmail(userId);

    const existing = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { gym: true },
    });

    if (existing?.gym) {
      return NextResponse.json(
        {
          error:
            "This account is registered as a gym. Sign out and create a separate account to register as a coach.",
        },
        { status: 409 }
      );
    }

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email, role: "COACH" },
      create: {
        clerkId: userId,
        email,
        role: "COACH",
      },
    });

    const coach = await prisma.coach.upsert({
      where: { userId: user.id },
      update: data,
      create: { userId: user.id, ...data },
    });

    await prisma.workExperience.deleteMany({ where: { coachId: coach.id } });

    if (experiences.length > 0) {
      await prisma.workExperience.createMany({
        data: experiences.map((exp, index) => ({
          coachId: coach.id,
          position: exp.position,
          organization: exp.organization,
          description: exp.description,
          reasonLeft: exp.reasonLeft || null,
          startDate: exp.startDate,
          endDate: exp.endDate || null,
          sortOrder: index,
        })),
      });
    }

    const fullCoach = await prisma.coach.findUnique({
      where: { id: coach.id },
      include: { experiences: { orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json(fullCoach, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: formatZodError(err) }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        coach: {
          include: { experiences: { orderBy: { sortOrder: "asc" } } },
        },
      },
    });
    if (!user?.coach) return NextResponse.json({ error: "Coach profile not found" }, { status: 404 });

    return NextResponse.json(user.coach);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const coachPatchSchema = z
  .object({
    photoUrl: z.string().nullable().optional(),
    workAuthorizationStatus: z.enum(WORK_AUTH_STATUSES).nullable().optional(),
    locationType: z.enum(["US", "INTERNATIONAL"]).optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    country: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.locationType === undefined &&
      data.city === undefined &&
      data.state === undefined &&
      data.country === undefined
    ) {
      return;
    }

    if (!data.locationType || !data.city || !data.state) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Location type, city, and state are required",
      });
      return;
    }

    const locationResult = coachLocationSchema.safeParse({
      locationType: data.locationType,
      city: data.city,
      state: data.state,
      country: data.country ?? undefined,
    });
    if (!locationResult.success) {
      locationResult.error.issues.forEach((issue) => ctx.addIssue(issue));
    }
  });

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { coach: true },
    });

    if (!user?.coach) {
      return NextResponse.json({ error: "Coach profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const data = coachPatchSchema.parse(body);

    const locationUpdate =
      data.locationType !== undefined ||
      data.city !== undefined ||
      data.state !== undefined ||
      data.country !== undefined
        ? coachLocationToPayload({
            locationType: data.locationType ?? user.coach.locationType ?? "US",
            city: data.city ?? user.coach.city ?? "",
            state: data.state ?? user.coach.state ?? "",
            country: data.country ?? user.coach.country ?? "",
          })
        : null;

    const coach = await prisma.coach.update({
      where: { id: user.coach.id },
      data: {
        ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
        ...(data.workAuthorizationStatus !== undefined && {
          workAuthorizationStatus: data.workAuthorizationStatus,
        }),
        ...(locationUpdate && locationUpdate),
      },
      include: { experiences: { orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json(coach);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: formatZodError(err) }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
