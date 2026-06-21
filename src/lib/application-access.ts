import { prisma } from "@/lib/prisma";

export async function getApplicationAccess(clerkId: string, applicationId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { coach: true, gym: true },
  });

  if (!user) return null;

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      coach: { include: { user: true } },
      job: { include: { gym: { include: { user: true } } } },
      conversation: true,
    },
  });

  if (!application) return null;

  const isCoach = user.coach?.id === application.coachId;
  const isGym = user.gym?.id === application.job.gymId;

  if (!isCoach && !isGym) return null;

  return { user, application, isCoach, isGym };
}
