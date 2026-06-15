import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncClerkEmail } from "@/lib/email/get-user-email";
import { z } from "zod";

const coachSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  beltRank: z.enum(["WHITE", "BLUE", "PURPLE", "BROWN", "BLACK"]),
  affiliation: z.string().optional(),
  yearsTeaching: z.number().min(0).default(0),
  specialties: z.array(z.string()).default([]),
  targetCity: z.string().optional(),
  bio: z.string().optional(),
  minPay: z.number().optional(),
  maxPay: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const data = coachSchema.parse(body);

    const email = await syncClerkEmail(userId);

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email },
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

    return NextResponse.json(coach, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId }, include: { coach: true } });
    if (!user?.coach) return NextResponse.json({ error: "Coach profile not found" }, { status: 404 });

    return NextResponse.json(user.coach);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
