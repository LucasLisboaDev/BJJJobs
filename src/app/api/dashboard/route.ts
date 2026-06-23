import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getIntendedRole(metadata: Record<string, unknown> | undefined) {
  const role = metadata?.role;
  if (role === "GYM" || role === "COACH") return role;
  return null;
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clerkUser = await clerkClient.users.getUser(userId);
    const intendedRole = getIntendedRole(clerkUser.unsafeMetadata as Record<string, unknown>);

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        gym: {
          include: {
            jobs: {
              include: {
                _count: { select: { applications: true } },
                applications: {
                  where: { status: "pending" },
                  select: { id: true, viewedAt: true },
                },
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

    if (!user) {
      return NextResponse.json({ role: null, gym: null, coach: null, intendedRole });
    }

    return NextResponse.json({
      role: user.role,
      gym: user.gym ?? null,
      coach: user.coach ?? null,
      intendedRole: user.role,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
