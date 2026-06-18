import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gym = await prisma.gym.findUnique({
      where: { id: params.id },
      include: {
        jobs: {
          where: { active: true },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { jobs: true } },
      },
    });

    if (!gym) return NextResponse.json({ error: "Gym not found" }, { status: 404 });

    return NextResponse.json(gym);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
