import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const jobUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "REVENUE_SHARE"]).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  minBelt: z.enum(["WHITE", "BLUE", "PURPLE", "BROWN", "BLACK"]).optional(),
  minYearsTeaching: z.number().min(0).optional(),
  styles: z.array(z.string()).optional(),
  perks: z.array(z.string()).optional(),
  description: z.string().min(1).optional(),
  minPay: z.number().optional().nullable(),
  maxPay: z.number().optional().nullable(),
  payType: z.string().optional(),
  active: z.boolean().optional(),
  workPermitRequired: z.boolean().optional(),
  sponsorshipAvailable: z.boolean().optional(),
});

async function getGymJob(jobId: string, clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { gym: true },
  });
  if (!user?.gym) return null;

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.gymId !== user.gym.id) return null;

  return { user, job };
}

// GET — single job detail
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        gym: true,
        _count: { select: { applications: true } },
      },
    });

    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    return NextResponse.json(job);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — gym updates a job
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const owned = await getGymJob(params.id, userId);
    if (!owned) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const body = await req.json();
    const data = jobUpdateSchema.parse(body);

    const job = await prisma.job.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(job);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — gym removes a listing
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const owned = await getGymJob(params.id, userId);
    if (!owned) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    await prisma.job.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
