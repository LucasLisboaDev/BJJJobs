import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getUserEmail(clerkId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (user?.email) return user.email;

  try {
    const clerkUser = await clerkClient.users.getUser(clerkId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) return null;

    if (user) {
      await prisma.user.update({ where: { clerkId }, data: { email } });
    }
    return email;
  } catch {
    return null;
  }
}

export async function syncClerkEmail(clerkId: string): Promise<string> {
  const clerkUser = await clerkClient.users.getUser(clerkId);
  const email =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("No email found on Clerk account");
  }

  return email;
}
