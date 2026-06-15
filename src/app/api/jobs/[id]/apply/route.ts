import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const applySchema = z.object({
  message: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { coach: true },
    });

    if (!user?.coach) {
      return NextResponse.json({ error: "Coach profile required to apply" }, { status: 403 });
    }

    const job = await prisma.job.findUnique({ where: { id: params.id } });
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const body = await req.json();
    const { message } = applySchema.parse(body);

    const application = await prisma.application.create({
      data: {
        jobId: params.id,
        coachId: user.coach.id,
        message,
        status: "pending",
      },
      include: { job: { include: { gym: true } }, coach: true },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (err: any) {
    // Unique constraint = already applied
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "You have already applied to this job" }, { status: 409 });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET — check if current coach already applied
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ applied: false });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { coach: true },
    });

    if (!user?.coach) return NextResponse.json({ applied: false });

    const existing = await prisma.application.findUnique({
      where: { jobId_coachId: { jobId: params.id, coachId: user.coach.id } },
    });

    return NextResponse.json({ applied: !!existing, application: existing });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ applied: false });
  }
}
