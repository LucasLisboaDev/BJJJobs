import { execSync } from "child_process";
import { config as loadEnv } from "dotenv";
import { writeFileSync } from "fs";
import { resolve } from "path";
import {
  resolveDatabaseUrl,
  assertSafeTestDatabase,
  resetDatabase,
  seedGym,
  seedJob,
} from "./helpers/db";

export default async function globalSetup() {
  loadEnv({ path: ".env.local" });
  loadEnv({ path: ".env.test", override: true });

  const databaseUrl = resolveDatabaseUrl();
  if (!databaseUrl) return;

  try {
    assertSafeTestDatabase(databaseUrl);
  } catch {
    return;
  }

  process.env.DATABASE_URL = databaseUrl;

  execSync("npx prisma db push --skip-generate", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });

  await resetDatabase();

  const gymUser = await seedGym();
  const activeJob = await seedJob(gymUser.gym!.id, {
    title: "E2E Test Coach Position",
    description: "Automated test listing — safe to ignore.",
  });
  const inactiveJob = await seedJob(gymUser.gym!.id, {
    title: "E2E Closed Position",
    description: "Inactive listing for UI test.",
    active: false,
  });

  writeFileSync(
    resolve(__dirname, ".seed-state.json"),
    JSON.stringify({ activeJobId: activeJob.id, inactiveJobId: inactiveJob.id })
  );
}
