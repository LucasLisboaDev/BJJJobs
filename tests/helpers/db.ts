import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

export function getTestPrisma(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: { db: { url: resolveDatabaseUrl() } },
    });
  }
  return prisma;
}

export function resolveDatabaseUrl(): string {
  return process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL ?? "";
}

/** Refuse to wipe a non-test database unless explicitly allowed. */
export function assertSafeTestDatabase(url: string) {
  if (!url) {
    throw new Error(
      "TEST_DATABASE_URL (or DATABASE_URL in CI) is required. Copy .env.test.example → .env.test"
    );
  }

  const allowed =
    process.env.CI === "true" ||
    process.env.ALLOW_TEST_ON_MAIN_DB === "1" ||
    /test|_test|jiujitsujobs_test/i.test(url);

  if (!allowed) {
    throw new Error(
      "Refusing to run tests: point TEST_DATABASE_URL at a dedicated test database " +
        "(or set ALLOW_TEST_ON_MAIN_DB=1 to override — this WIPES all data)."
    );
  }
}

export async function resetDatabase() {
  const db = getTestPrisma();
  await db.message.deleteMany();
  await db.conversation.deleteMany();
  await db.application.deleteMany();
  await db.job.deleteMany();
  await db.workExperience.deleteMany();
  await db.coach.deleteMany();
  await db.gym.deleteMany();
  await db.user.deleteMany();
}

export const TEST_CLERK = {
  gym: "clerk_test_gym_001",
  coach: "clerk_test_coach_001",
  coach2: "clerk_test_coach_002",
} as const;

export async function seedGym(clerkId = TEST_CLERK.gym) {
  const db = getTestPrisma();
  return db.user.create({
    data: {
      clerkId,
      email: "gym@test.jiujitsujobs.com",
      role: "GYM",
      gym: {
        create: {
          name: "Test Alliance Miami",
          city: "Miami",
          state: "FL",
          affiliation: "Alliance",
          instagram: "testgym",
        },
      },
    },
    include: { gym: true },
  });
}

export async function seedCoach(clerkId = TEST_CLERK.coach) {
  const db = getTestPrisma();
  return db.user.create({
    data: {
      clerkId,
      email: "coach@test.jiujitsujobs.com",
      role: "COACH",
      coach: {
        create: {
          firstName: "Test",
          lastName: "Coach",
          beltRank: "BROWN",
          yearsTeaching: 5,
          specialties: ["Gi", "No-Gi"],
          targetCity: "Miami, FL",
          locationType: "US",
          city: "Miami",
          state: "FL",
          instagram: "testcoach",
        },
      },
    },
    include: { coach: true },
  });
}

export async function seedJob(gymId: string, overrides: Record<string, unknown> = {}) {
  const db = getTestPrisma();
  return db.job.create({
    data: {
      gymId,
      title: "Head BJJ Coach",
      jobType: "FULL_TIME",
      city: "Miami",
      state: "FL",
      minBelt: "PURPLE",
      minYearsTeaching: 2,
      styles: ["Gi", "No-Gi"],
      perks: ["Flexible schedule"],
      description: "Lead adult classes and competition team.",
      minPay: 30,
      maxPay: 50,
      payType: "hourly",
      active: true,
      ...overrides,
    },
  });
}

export async function seedApplication(jobId: string, coachId: string, status = "pending") {
  const db = getTestPrisma();
  return db.application.create({
    data: {
      jobId,
      coachId,
      status,
      message: "I would love to coach at your gym.",
      conversation: { create: {} },
    },
  });
}
