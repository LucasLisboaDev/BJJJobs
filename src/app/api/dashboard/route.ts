import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        gym: {
          include: {
            jobs: {
              include: {
                _count: { select: { applications: true } },
              },
              orderBy: { createdAt: "desc" },
            },
          },
        },
        coach: {
          include: {
            applications: {
              include: {
                job: { include: { gym: true } },
              },
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!user) return NextResponse.json({ role: null, gym: null, coach: null });

    return NextResponse.json({
      role: user.role,
      gym: user.gym ?? null,
      coach: user.coach ?? null,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
