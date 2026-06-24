import { describe, it, expect, beforeAll } from "vitest";
import { POST as createJob, GET as listJobs } from "@/app/api/jobs/route";
import { PATCH as patchJob } from "@/app/api/jobs/[id]/route";
import { jsonRequest } from "../helpers/request";
import { mockSignedInAs } from "../helpers/mocks";
import {
  seedGym,
  seedCoach,
  seedJob,
  TEST_CLERK,
  resolveDatabaseUrl,
  assertSafeTestDatabase,
} from "../helpers/db";

describe("Jobs API", () => {
  beforeAll(() => {
    const url = resolveDatabaseUrl();
    assertSafeTestDatabase(url);
    process.env.DATABASE_URL = url;
  });

  it("gym creates an active job listing", async () => {
    await seedGym();

    mockSignedInAs(TEST_CLERK.gym);
    const res = await createJob(
      jsonRequest("http://localhost/api/jobs", "POST", {
        title: "Kids BJJ Coach",
        jobType: "PART_TIME",
        city: "Miami",
        state: "FL",
        minBelt: "BLUE",
        minYearsTeaching: 1,
        styles: ["Kids program"],
        perks: ["Free membership"],
        description: "Teach kids classes Tue/Thu.",
        minPay: 25,
        maxPay: 35,
        payType: "hourly",
      })
    );

    expect(res.status).toBe(201);
    const job = await res.json();
    expect(job.title).toBe("Kids BJJ Coach");
    expect(job.active).toBe(true);
    expect(job.gym).toBeTruthy();
  });

  it("coach cannot create a job", async () => {
    await seedCoach();

    mockSignedInAs(TEST_CLERK.coach);
    const res = await createJob(
      jsonRequest("http://localhost/api/jobs", "POST", {
        title: "Should fail",
        jobType: "FULL_TIME",
        city: "Miami",
        state: "FL",
        description: "Nope",
      })
    );

    expect(res.status).toBe(403);
  });

  it("lists only active jobs on public browse", async () => {
    const gymUser = await seedGym();
    await seedJob(gymUser.gym!.id, { title: "Active role", active: true });
    await seedJob(gymUser.gym!.id, { title: "Closed role", active: false });

    const res = await listJobs(new Request("http://localhost/api/jobs"));
    expect(res.status).toBe(200);

    const jobs = await res.json();
    expect(jobs.some((j: { title: string }) => j.title === "Active role")).toBe(true);
    expect(jobs.some((j: { title: string }) => j.title === "Closed role")).toBe(false);
  });

  it("gym can toggle job inactive via PATCH", async () => {
    const gymUser = await seedGym();
    const job = await seedJob(gymUser.gym!.id);

    mockSignedInAs(TEST_CLERK.gym);
    const res = await patchJob(
      jsonRequest(`http://localhost/api/jobs/${job.id}`, "PATCH", { active: false }),
      { params: { id: job.id } }
    );

    expect(res.status).toBe(200);
    const updated = await res.json();
    expect(updated.active).toBe(false);
  });

  it("unauthorized user cannot PATCH a job", async () => {
    const gymUser = await seedGym();
    const job = await seedJob(gymUser.gym!.id);

    mockSignedInAs("clerk_random_intruder");
    const res = await patchJob(
      jsonRequest(`http://localhost/api/jobs/${job.id}`, "PATCH", { active: false }),
      { params: { id: job.id } }
    );

    expect(res.status).toBe(403);
  });
});
