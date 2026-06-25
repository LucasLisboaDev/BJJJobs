import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { coach: true, gym: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isCoach = !!user.coach;
    const isGym = !!user.gym;

    if (!isCoach && !isGym) {
      return NextResponse.json({ error: "Profile required" }, { status: 403 });
    }

    const applications = await prisma.application.findMany({
      where: isCoach
        ? { coachId: user.coach!.id }
        : { job: { gymId: user.gym!.id } },
      include: {
        coach: {
          select: { firstName: true, lastName: true, photoUrl: true },
        },
        job: {
          select: {
            id: true,
            title: true,
            gym: { select: { name: true, logoUrl: true } },
          },
        },
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { body: true, createdAt: true, senderUserId: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const conversationIds = applications
      .map((a) => a.conversation?.id)
      .filter((id): id is string => !!id);

    const unreadByConversation =
      conversationIds.length > 0
        ? await prisma.message.groupBy({
            by: ["conversationId"],
            where: {
              conversationId: { in: conversationIds },
              senderUserId: { not: user.id },
              readAt: null,
            },
            _count: { _all: true },
          })
        : [];

    const unreadMap = new Map(
      unreadByConversation.map((row) => [row.conversationId, row._count._all])
    );

    const conversations = applications
      .filter((app) => app.conversation)
      .map((app) => {
        const lastMsg = app.conversation!.messages[0] ?? null;
        const counterpartName = isCoach
          ? app.job.gym.name
          : `${app.coach.firstName} ${app.coach.lastName}`;
        const counterpartPhoto = isCoach ? app.job.gym.logoUrl : app.coach.photoUrl;

        return {
          applicationId: app.id,
          jobId: app.job.id,
          jobTitle: app.job.title,
          status: app.status,
          counterpartName,
          counterpartPhoto,
          lastMessage: lastMsg
            ? {
                body: lastMsg.body,
                createdAt: lastMsg.createdAt,
                isMine: lastMsg.senderUserId === user.id,
              }
            : null,
          unreadCount: unreadMap.get(app.conversation!.id) ?? 0,
          updatedAt: lastMsg?.createdAt ?? app.createdAt,
        };
      })
      .sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

    const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

    return NextResponse.json({
      viewerRole: isCoach ? "coach" : "gym",
      totalUnread,
      conversations,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
