import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isApplicationStatus } from "@/lib/application-status";
import {
  sendApplicationStatusEmail,
  sendApplicationViewedEmail,
} from "@/lib/email/send";

const applicationInclude = {
  coach: {
    include: {
      user: true,
      experiences: { orderBy: { sortOrder: "asc" as const } },
    },
  },
  job: { include: { gym: { include: { user: true } } } },
} as const;

const coachApplicationSelect = {
  id: true,
  firstName: true,
  lastName: true,
  beltRank: true,
  affiliation: true,
  instagram: true,
  yearsTeaching: true,
  specialties: true,
  targetCity: true,
  bio: true,
  competitionRecord: true,
  minPay: true,
  maxPay: true,
  resumeUrl: true,
  resumeFileName: true,
  experiences: { orderBy: { sortOrder: "asc" as const } },
};

// GET — gym views applicants for one of their jobs
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { gym: true },
    });

    if (!user?.gym) return NextResponse.json({ error: "Gym profile required" }, { status: 403 });

    const job = await prisma.job.findUnique({ where: { id: params.id } });
    if (!job || job.gymId !== user.gym.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const applications = await prisma.application.findMany({
      where: { jobId: params.id },
      include: {
        coach: { select: coachApplicationSelect },
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const unviewed = applications.filter((a) => !a.viewedAt);
    if (unviewed.length > 0) {
      const now = new Date();
      await prisma.application.updateMany({
        where: { id: { in: unviewed.map((a) => a.id) } },
        data: { viewedAt: now },
      });

      for (const app of unviewed) {
        const full = await prisma.application.findUnique({
          where: { id: app.id },
          include: applicationInclude,
        });
        if (full) {
          sendApplicationViewedEmail(full).catch((err) =>
            console.error("Failed to send viewed email:", err)
          );
        }
      }
    }

    return NextResponse.json(
      applications.map((a) => ({
        ...a,
        viewedAt: a.viewedAt ?? (unviewed.some((u) => u.id === a.id) ? new Date() : null),
      }))
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — update application status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { gym: true },
    });

    if (!user?.gym) return NextResponse.json({ error: "Gym profile required" }, { status: 403 });

    const job = await prisma.job.findUnique({ where: { id: params.id } });
    if (!job || job.gymId !== user.gym.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { applicationId, status, closeJob } = await req.json();

    if (!isApplicationStatus(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const existing = await prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!existing || existing.jobId !== params.id) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: applicationInclude,
    });

    if (status === "hired" && closeJob) {
      await prisma.job.update({
        where: { id: params.id },
        data: { active: false },
      });
    }

    if (existing.status !== status && ["shortlisted", "rejected", "hired"].includes(status)) {
      sendApplicationStatusEmail(updated, status).catch((err) =>
        console.error("Failed to send status email:", err)
      );
    }

    return NextResponse.json({
      ...updated,
      jobClosed: status === "hired" && closeJob,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
