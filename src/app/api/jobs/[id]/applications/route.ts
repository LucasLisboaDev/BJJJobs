import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json(applications);
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

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
