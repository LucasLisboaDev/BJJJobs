import { execSync } from "child_process";
import { config as loadEnv } from "dotenv";
import { resolveDatabaseUrl, assertSafeTestDatabase } from "./helpers/db";

export default async function globalSetup() {
  loadEnv({ path: ".env.test" });
  loadEnv({ path: ".env.local" });

  const databaseUrl = resolveDatabaseUrl();
  assertSafeTestDatabase(databaseUrl);

  process.env.DATABASE_URL = databaseUrl;
  process.env.NODE_ENV = "test";

  execSync("npx prisma db push --skip-generate", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });
}
