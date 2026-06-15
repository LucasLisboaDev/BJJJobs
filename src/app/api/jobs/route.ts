import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().min(1),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "REVENUE_SHARE"]),
  city: z.string().min(1),
  state: z.string().min(1),
  minBelt: z.enum(["WHITE", "BLUE", "PURPLE", "BROWN", "BLACK"]).default("WHITE"),
  minYearsTeaching: z.number().min(0).default(0),
  styles: z.array(z.string()).default([]),
  perks: z.array(z.string()).default([]),
  description: z.string().min(1),
  minPay: z.number().optional(),
  maxPay: z.number().optional(),
  payType: z.string().default("hourly"),
});

// POST — gym creates a job
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { gym: true },
    });

    if (!user?.gym) {
      return NextResponse.json({ error: "Gym profile required to post a job" }, { status: 403 });
    }

    const body = await req.json();
    const data = jobSchema.parse(body);

    const job = await prisma.job.create({
      data: { gymId: user.gym.id, ...data },
      include: { gym: true },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET — browse jobs with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const belt = searchParams.get("belt");
    const jobType = searchParams.get("jobType");
    const query = searchParams.get("q");

    const jobs = await prisma.job.findMany({
      where: {
        active: true,
        ...(city && { city: { contains: city, mode: "insensitive" } }),
        ...(belt && { minBelt: belt as any }),
        ...(jobType && { jobType: jobType as any }),
        ...(query && {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }),
      },
      include: { gym: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(jobs);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
