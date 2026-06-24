import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncClerkEmail } from "@/lib/email/get-user-email";
import { optionalInstagramSchema } from "@/lib/instagram";
import { z } from "zod";

const experienceSchema = z.object({
  position: z.string().min(1),
  organization: z.string().min(1),
  description: z.string().min(1),
  reasonLeft: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
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
    bio: z.string().optional(),
    minPay: z.number().optional(),
    maxPay: z.number().optional(),
    resumeUrl: z.string().optional(),
    resumeFileName: z.string().optional(),
    instagram: optionalInstagramSchema,
    experiences: z.array(experienceSchema).default([]),
  })
  .refine((data) => data.resumeUrl || data.experiences.length > 0, {
    message: "Upload a resume or add at least one work experience entry",
    path: ["experiences"],
  });

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = coachSchema.parse(body);
    const { experiences, ...data } = parsed;

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
      const message = err.errors[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: message }, { status: 400 });
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

const coachPatchSchema = z.object({
  photoUrl: z.string().nullable().optional(),
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

    const coach = await prisma.coach.update({
      where: { id: user.coach.id },
      data: {
        ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
      },
      include: { experiences: { orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json(coach);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
