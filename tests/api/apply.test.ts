import { describe, it, expect, beforeAll } from "vitest";
import { POST as applyToJob, GET as checkApplied } from "@/app/api/jobs/[id]/apply/route";
import { jsonRequest } from "../helpers/request";
import { mockSignedInAs, emailMocks } from "../helpers/mocks";
import {
  seedGym,
  seedCoach,
  seedJob,
  TEST_CLERK,
  resolveDatabaseUrl,
  assertSafeTestDatabase,
  getTestPrisma,
} from "../helpers/db";

describe("Apply API", () => {
  beforeAll(() => {
    const url = resolveDatabaseUrl();
    assertSafeTestDatabase(url);
    process.env.DATABASE_URL = url;
  });

  it("coach applies to an active job and triggers emails", async () => {
    const gymUser = await seedGym();
    const coachUser = await seedCoach();
    const job = await seedJob(gymUser.gym!.id);

    mockSignedInAs(TEST_CLERK.coach);
    const res = await applyToJob(
      jsonRequest(`http://localhost/api/jobs/${job.id}/apply`, "POST", {
        message: "Excited to join your team!",
      }),
      { params: { id: job.id } }
    );

    expect(res.status).toBe(201);
    const application = await res.json();
    expect(application.status).toBe("pending");
    expect(application.coachId).toBe(coachUser.coach!.id);

    expect(emailMocks.sendNewApplicationEmail).toHaveBeenCalledTimes(1);
    expect(emailMocks.sendApplicationConfirmationEmail).toHaveBeenCalledTimes(1);
  });

  it("blocks duplicate applications", async () => {
    const gymUser = await seedGym();
    await seedCoach();
    const job = await seedJob(gymUser.gym!.id);

    mockSignedInAs(TEST_CLERK.coach);
    await applyToJob(
      jsonRequest(`http://localhost/api/jobs/${job.id}/apply`, "POST", {}),
      { params: { id: job.id } }
    );

    const res = await applyToJob(
      jsonRequest(`http://localhost/api/jobs/${job.id}/apply`, "POST", {}),
      { params: { id: job.id } }
    );

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toMatch(/already applied/i);
  });

  it("blocks apply on inactive jobs", async () => {
    const gymUser = await seedGym();
    await seedCoach();
    const job = await seedJob(gymUser.gym!.id, { active: false });

    mockSignedInAs(TEST_CLERK.coach);
    const res = await applyToJob(
      jsonRequest(`http://localhost/api/jobs/${job.id}/apply`, "POST", {}),
      { params: { id: job.id } }
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/no longer accepting/i);
  });

  it("blocks gym accounts from applying", async () => {
    const gymUser = await seedGym();
    await seedCoach();
    const job = await seedJob(gymUser.gym!.id);

    mockSignedInAs(TEST_CLERK.gym);
    const res = await applyToJob(
      jsonRequest(`http://localhost/api/jobs/${job.id}/apply`, "POST", {}),
      { params: { id: job.id } }
    );

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toMatch(/gym accounts cannot apply/i);
  });

  it("requires coach profile to apply", async () => {
    const gymUser = await seedGym();
    const job = await seedJob(gymUser.gym!.id);

    mockSignedInAs("clerk_no_profile_user");
    const res = await applyToJob(
      jsonRequest(`http://localhost/api/jobs/${job.id}/apply`, "POST", {}),
      { params: { id: job.id } }
    );

    expect(res.status).toBe(403);
  });

  it("GET apply reports applied state for coach", async () => {
    const gymUser = await seedGym();
    const coachUser = await seedCoach();
    const job = await seedJob(gymUser.gym!.id);
    const db = getTestPrisma();

    await db.application.create({
      data: {
        jobId: job.id,
        coachId: coachUser.coach!.id,
        status: "shortlisted",
        conversation: { create: {} },
      },
    });

    mockSignedInAs(TEST_CLERK.coach);
    const res = await checkApplied(new Request(`http://localhost/api/jobs/${job.id}/apply`), {
      params: { id: job.id },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.applied).toBe(true);
    expect(body.application.status).toBe("shortlisted");
    expect(body.isCoach).toBe(true);
  });
});
