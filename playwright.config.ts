import { config as loadEnv } from "dotenv";
import { defineConfig, devices } from "@playwright/test";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env.test", override: true });

const testDatabaseUrl =
  process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL ?? "";
// Local E2E uses :3001 so it doesn't clash with `npm run dev` on :3000 (which uses Railway DB).
const e2ePort = process.env.PLAYWRIGHT_PORT ?? (process.env.CI ? "3000" : "3001");
const baseURL = `http://localhost:${e2ePort}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "html",
  use: {
    baseURL,
    trace: "on-first-retry",
    ...devices["Desktop Chrome"],
  },
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: `next dev -p ${e2ePort}`,
        port: Number(e2ePort),
        reuseExistingServer: false,
        timeout: 180_000,
        env: {
          ...process.env,
          DATABASE_URL: testDatabaseUrl,
          PORT: e2ePort,
          NEXT_DIST_DIR: ".next-e2e",
        },
      },
  globalSetup: "./tests/playwright-global-setup.ts",
});
