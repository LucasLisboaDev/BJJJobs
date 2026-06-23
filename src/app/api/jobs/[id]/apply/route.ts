import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewApplicationEmail, sendApplicationConfirmationEmail } from "@/lib/email/send";
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
      include: { coach: true, gym: true },
    });

    if (user?.gym) {
      return NextResponse.json(
        { error: "Gym accounts cannot apply to jobs. Sign in with a coach account." },
        { status: 403 }
      );
    }

    if (!user?.coach) {
      return NextResponse.json({ error: "Coach profile required to apply" }, { status: 403 });
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: { gym: true },
    });
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    if (!job.active) {
      return NextResponse.json(
        { error: "This position is no longer accepting applications" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { message } = applySchema.parse(body);

    const application = await prisma.application.create({
      data: {
        jobId: params.id,
        coachId: user.coach.id,
        message,
        status: "pending",
        conversation: {
          create: {
            messages: message
              ? {
                  create: {
                    senderUserId: user.id,
                    body: message,
                  },
                }
              : undefined,
          },
        },
      },
      include: {
        job: { include: { gym: { include: { user: true } } } },
        coach: { include: { user: true, experiences: { orderBy: { sortOrder: "asc" } } } },
      },
    });

    sendNewApplicationEmail(application).catch((err) =>
      console.error("Failed to send application email:", err)
    );
    sendApplicationConfirmationEmail(application).catch((err) =>
      console.error("Failed to send coach confirmation email:", err)
    );

    return NextResponse.json(application, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "You have already applied to this job" }, { status: 409 });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ applied: false });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { coach: true, gym: true },
    });

    if (!user?.coach) {
      return NextResponse.json({
        applied: false,
        isCoach: false,
        isGym: !!user?.gym,
      });
    }

    const existing = await prisma.application.findUnique({
      where: { jobId_coachId: { jobId: params.id, coachId: user.coach.id } },
    });

    return NextResponse.json({
      applied: !!existing,
      application: existing,
      isCoach: true,
      isGym: false,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ applied: false });
  }
}
