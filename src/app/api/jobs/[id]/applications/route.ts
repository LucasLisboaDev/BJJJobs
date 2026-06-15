import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendApplicationStatusEmail,
  sendApplicationViewedEmail,
} from "@/lib/email/send";

const applicationInclude = {
  coach: { include: { user: true } },
  job: { include: { gym: { include: { user: true } } } },
} as const;

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
      include: { coach: true },
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

// PATCH — update application status (shortlist, reject, etc.)
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

    const { applicationId, status } = await req.json();

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

    if (existing.status !== status && (status === "shortlisted" || status === "rejected")) {
      sendApplicationStatusEmail(updated, status).catch((err) =>
        console.error("Failed to send status email:", err)
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
