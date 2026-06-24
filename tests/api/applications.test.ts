import { describe, it, expect, beforeAll } from "vitest";
import { GET as getApplicants, PATCH as patchApplication } from "@/app/api/jobs/[id]/applications/route";
import { jsonRequest } from "../helpers/request";
import { mockSignedInAs, emailMocks } from "../helpers/mocks";
import {
  seedGym,
  seedCoach,
  seedJob,
  seedApplication,
  TEST_CLERK,
  resolveDatabaseUrl,
  assertSafeTestDatabase,
  getTestPrisma,
} from "../helpers/db";

describe("Applications API (gym review)", () => {
  beforeAll(() => {
    const url = resolveDatabaseUrl();
    assertSafeTestDatabase(url);
    process.env.DATABASE_URL = url;
  });

  async function seedAppliedJob() {
    const gymUser = await seedGym();
    const coachUser = await seedCoach();
    const job = await seedJob(gymUser.gym!.id);
    const application = await seedApplication(job.id, coachUser.coach!.id);
    return { gymUser, coachUser, job, application };
  }

  it("gym loads applicants and marks them viewed", async () => {
    const { job, application } = await seedAppliedJob();

    mockSignedInAs(TEST_CLERK.gym);
    const res = await getApplicants(new Request(`http://localhost/api/jobs/${job.id}/applications`), {
      params: { id: job.id },
    });

    expect(res.status).toBe(200);
    const apps = await res.json();
    expect(apps).toHaveLength(1);
    expect(apps[0].id).toBe(application.id);
    expect(apps[0].coach.firstName).toBe("Test");
    expect(apps[0].coach.instagram).toBe("testcoach");
    expect(apps[0].viewedAt).toBeTruthy();

    expect(emailMocks.sendApplicationViewedEmail).toHaveBeenCalledTimes(1);
  });

  it("gym shortlists applicant and coach receives status email", async () => {
    const { job, application } = await seedAppliedJob();

    mockSignedInAs(TEST_CLERK.gym);
    const res = await patchApplication(
      jsonRequest(`http://localhost/api/jobs/${job.id}/applications`, "PATCH", {
        applicationId: application.id,
        status: "shortlisted",
      }),
      { params: { id: job.id } }
    );

    expect(res.status).toBe(200);
    const updated = await res.json();
    expect(updated.status).toBe("shortlisted");
    expect(emailMocks.sendApplicationStatusEmail).toHaveBeenCalledTimes(1);
    expect(emailMocks.sendApplicationStatusEmail).toHaveBeenCalledWith(
      expect.objectContaining({ id: application.id }),
      "shortlisted"
    );
  });

  it("gym declines applicant and coach receives status email", async () => {
    const { job, application } = await seedAppliedJob();

    mockSignedInAs(TEST_CLERK.gym);
    const res = await patchApplication(
      jsonRequest(`http://localhost/api/jobs/${job.id}/applications`, "PATCH", {
        applicationId: application.id,
        status: "rejected",
      }),
      { params: { id: job.id } }
    );

    expect(res.status).toBe(200);
    const updated = await res.json();
    expect(updated.status).toBe("rejected");
    expect(emailMocks.sendApplicationStatusEmail).toHaveBeenCalledWith(
      expect.objectContaining({ id: application.id }),
      "rejected"
    );
  });

  it("gym marks applicant as hired and can close the listing", async () => {
    const { job, application } = await seedAppliedJob();

    mockSignedInAs(TEST_CLERK.gym);
    const res = await patchApplication(
      jsonRequest(`http://localhost/api/jobs/${job.id}/applications`, "PATCH", {
        applicationId: application.id,
        status: "hired",
        closeJob: true,
      }),
      { params: { id: job.id } }
    );

    expect(res.status).toBe(200);
    const updated = await res.json();
    expect(updated.status).toBe("hired");
    expect(updated.jobClosed).toBe(true);

    const db = getTestPrisma();
    const closedJob = await db.job.findUnique({ where: { id: job.id } });
    expect(closedJob?.active).toBe(false);

    expect(emailMocks.sendApplicationStatusEmail).toHaveBeenCalledWith(
      expect.objectContaining({ id: application.id }),
      "hired"
    );
  });

  it("rejects invalid status values", async () => {
    const { job, application } = await seedAppliedJob();

    mockSignedInAs(TEST_CLERK.gym);
    const res = await patchApplication(
      jsonRequest(`http://localhost/api/jobs/${job.id}/applications`, "PATCH", {
        applicationId: application.id,
        status: "maybe",
      }),
      { params: { id: job.id } }
    );

    expect(res.status).toBe(400);
  });
});
