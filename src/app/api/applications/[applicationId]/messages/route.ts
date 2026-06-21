import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getApplicationAccess } from "@/lib/application-access";
import { sendNewMessageEmail } from "@/lib/email/send";
import { z } from "zod";

const messageSchema = z.object({
  body: z.string().trim().min(1).max(2000),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await getApplicationAccess(userId, params.applicationId);
    if (!access) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const { user, application } = access;

    let conversation = application.conversation;
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { applicationId: application.id },
      });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
      include: {
        senderUser: {
          select: { id: true, role: true, coach: { select: { firstName: true, lastName: true } }, gym: { select: { name: true } } },
        },
      },
    });

    await prisma.message.updateMany({
      where: {
        conversationId: conversation.id,
        senderUserId: { not: user.id },
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return NextResponse.json({
      conversationId: conversation.id,
      messages: messages.map((m) => ({
        id: m.id,
        body: m.body,
        createdAt: m.createdAt,
        readAt: m.readAt,
        isMine: m.senderUserId === user.id,
        senderLabel:
          m.senderUser.role === "COACH"
            ? `${m.senderUser.coach?.firstName ?? "Coach"} ${m.senderUser.coach?.lastName ?? ""}`.trim()
            : m.senderUser.gym?.name ?? "Gym",
      })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await getApplicationAccess(userId, params.applicationId);
    if (!access) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const { user, application } = access;
    const { body } = messageSchema.parse(await req.json());

    let conversation = application.conversation;
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { applicationId: application.id },
      });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderUserId: user.id,
        body,
      },
      include: {
        senderUser: {
          select: { id: true, role: true, coach: { select: { firstName: true, lastName: true } }, gym: { select: { name: true } } },
        },
      },
    });

    sendNewMessageEmail({
      applicationId: application.id,
      jobId: application.job.id,
      jobTitle: application.job.title,
      gymName: application.job.gym.name,
      coachName: `${application.coach.firstName} ${application.coach.lastName}`,
      messageBody: body,
      senderRole: user.role,
      gymClerkId: application.job.gym.user.clerkId,
      coachClerkId: application.coach.user.clerkId,
    }).catch((err) => console.error("Failed to send message email:", err));

    return NextResponse.json(
      {
        id: message.id,
        body: message.body,
        createdAt: message.createdAt,
        readAt: message.readAt,
        isMine: true,
        senderLabel:
          user.role === "COACH"
            ? `${application.coach.firstName} ${application.coach.lastName}`
            : application.job.gym.name,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
