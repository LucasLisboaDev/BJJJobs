import { test, expect } from "@playwright/test";
import { clerk, clerkSetup } from "@clerk/testing/playwright";

/**
 * Full hiring-flow E2E requires Clerk test credentials.
 * Create two test users in Clerk (coach + gym) and set env vars from .env.test.example.
 *
 * Clerk testing docs: https://clerk.com/docs/testing/playwright
 */
const hasE2EAuth =
  !!process.env.CLERK_SECRET_KEY &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.E2E_GYM_EMAIL &&
  !!process.env.E2E_GYM_PASSWORD &&
  !!process.env.E2E_COACH_EMAIL &&
  !!process.env.E2E_COACH_PASSWORD;

test.describe("Hiring flow (Clerk auth)", () => {
  test.skip(!hasE2EAuth, "Set E2E_* and Clerk keys in .env.test to run authenticated E2E");

  test.beforeAll(async () => {
    await clerkSetup();
  });

  test("coach can browse jobs and see apply button when signed in", async ({ page }) => {
    await page.goto("/login");
    await clerk.signIn({
      page,
      signInParams: {
        strategy: "password",
        identifier: process.env.E2E_COACH_EMAIL!,
        password: process.env.E2E_COACH_PASSWORD!,
      },
    });

    await page.goto("/jobs");
    await expect(page.getByText("E2E Test Coach Position")).toBeVisible({ timeout: 15_000 });
    await page.getByText("E2E Test Coach Position").click();

    // Coach with completed profile should see Apply (or already-applied state)
    const applyOrApplied = page.getByRole("button", { name: /apply/i }).or(
      page.getByText(/application sent|shortlisted|hired/i)
    );
    await expect(applyOrApplied.first()).toBeVisible();
  });

  test("gym dashboard loads when signed in as gym", async ({ page }) => {
    await page.goto("/login");
    await clerk.signIn({
      page,
      signInParams: {
        strategy: "password",
        identifier: process.env.E2E_GYM_EMAIL!,
        password: process.env.E2E_GYM_PASSWORD!,
      },
    });

    await page.goto("/dashboard");
    await expect(page.getByText(/your listings|post a job|post your first job/i)).toBeVisible({
      timeout: 15_000,
    });
  });
});
