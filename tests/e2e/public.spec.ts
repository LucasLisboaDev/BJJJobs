import { readFileSync } from "fs";
import { resolve } from "path";
import { test, expect } from "@playwright/test";

function readSeedState(): { inactiveJobId?: string } {
  try {
    return JSON.parse(
      readFileSync(resolve(__dirname, "../.seed-state.json"), "utf-8")
    );
  } catch {
    return {};
  }
}

test.describe("Public pages", () => {
  test("home page loads and links to jobs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /browse jobs|jobs/i }).first()).toBeVisible();
  });

  test("jobs browse page lists seeded active job", async ({ page }) => {
    await page.goto("/jobs");
    await expect(page.getByText("E2E Test Coach Position")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("E2E Closed Position")).not.toBeVisible();
  });

  test("job detail shows apply CTA when signed out", async ({ page }) => {
    await page.goto("/jobs");
    await page.getByText("E2E Test Coach Position").click();
    await expect(page.getByRole("link", { name: /sign in.*apply/i })).toBeVisible();
  });

  test("inactive job shows not accepting applications", async ({ page }) => {
    const { inactiveJobId } = readSeedState();
    test.skip(!inactiveJobId, "Set TEST_DATABASE_URL for E2E seed");

    await page.goto(`/jobs/${inactiveJobId}`);
    await expect(page.getByText(/no longer accepting applications/i)).toBeVisible({
      timeout: 15_000,
    });
  });
});
