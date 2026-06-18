import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncClerkEmail } from "@/lib/email/get-user-email";
import { z } from "zod";

const gymSchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  affiliation: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const data = gymSchema.parse(body);

    const email = await syncClerkEmail(userId);

    const existing = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { coach: true },
    });

    if (existing?.coach) {
      return NextResponse.json(
        {
          error:
            "This account is registered as a coach. Sign out and create a separate account to register a gym.",
        },
        { status: 409 }
      );
    }

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email, role: "GYM" },
      create: {
        clerkId: userId,
        email,
        role: "GYM",
      },
    });

    const gym = await prisma.gym.upsert({
      where: { userId: user.id },
      update: data,
      create: { userId: user.id, ...data },
    });

    return NextResponse.json(gym, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId }, include: { gym: true } });
    if (!user?.gym) return NextResponse.json({ error: "Gym profile not found" }, { status: 404 });

    return NextResponse.json(user.gym);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { gym: true },
    });

    if (!user?.gym) {
      return NextResponse.json({ error: "Gym profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const data = gymSchema.parse(body);

    const gym = await prisma.gym.update({
      where: { id: user.gym.id },
      data,
    });

    return NextResponse.json(gym);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
