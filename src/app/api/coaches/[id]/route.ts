import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const coach = await prisma.coach.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { applications: true } },
      },
    });

    if (!coach) return NextResponse.json({ error: "Coach not found" }, { status: 404 });

    return NextResponse.json(coach);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
