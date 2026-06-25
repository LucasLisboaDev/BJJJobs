import { describe, it, expect, beforeAll } from "vitest";
import { GET as getConversations } from "@/app/api/conversations/route";
import { POST as postMessage } from "@/app/api/applications/[applicationId]/messages/route";
import { jsonRequest } from "../helpers/request";
import { mockSignedInAs, TEST_CLERK } from "../helpers/mocks";
import {
  seedGym,
  seedCoach,
  seedJob,
  seedApplication,
  resolveDatabaseUrl,
  assertSafeTestDatabase,
  getTestPrisma,
} from "../helpers/db";

describe("Conversations API", () => {
  beforeAll(() => {
    const url = resolveDatabaseUrl();
    assertSafeTestDatabase(url);
    process.env.DATABASE_URL = url;
  });

  it("coach lists conversations with unread counts", async () => {
    const gymUser = await seedGym();
    const coachUser = await seedCoach();
    const job = await seedJob(gymUser.gym!.id);
    const application = await seedApplication(job.id, coachUser.coach!.id);

    mockSignedInAs(TEST_CLERK.gym);
    await postMessage(
      jsonRequest(
        `http://localhost/api/applications/${application.id}/messages`,
        "POST",
        { body: "Hello coach, we'd love to chat." }
      ),
      { params: { applicationId: application.id } }
    );

    mockSignedInAs(TEST_CLERK.coach);
    const res = await getConversations();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.viewerRole).toBe("coach");
    expect(data.totalUnread).toBe(1);
    expect(data.conversations).toHaveLength(1);
    expect(data.conversations[0].applicationId).toBe(application.id);
    expect(data.conversations[0].counterpartName).toBe("Test Alliance Miami");
    expect(data.conversations[0].lastMessage?.body).toContain("Hello coach");
  });

  it("gym lists conversations with coach names", async () => {
    const gymUser = await seedGym();
    const coachUser = await seedCoach();
    const job = await seedJob(gymUser.gym!.id);
    const application = await seedApplication(job.id, coachUser.coach!.id);

    mockSignedInAs(TEST_CLERK.coach);
    await postMessage(
      jsonRequest(
        `http://localhost/api/applications/${application.id}/messages`,
        "POST",
        { body: "Thanks for considering my application!" }
      ),
      { params: { applicationId: application.id } }
    );

    mockSignedInAs(TEST_CLERK.gym);
    const res = await getConversations();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.viewerRole).toBe("gym");
    expect(data.totalUnread).toBe(1);
    expect(data.conversations[0].counterpartName).toBe("Test Coach");
  });

  it("marks messages read when coach opens thread via messages API", async () => {
    const gymUser = await seedGym();
    const coachUser = await seedCoach();
    const job = await seedJob(gymUser.gym!.id);
    const application = await seedApplication(job.id, coachUser.coach!.id);
    const db = getTestPrisma();

    mockSignedInAs(TEST_CLERK.gym);
    await postMessage(
      jsonRequest(
        `http://localhost/api/applications/${application.id}/messages`,
        "POST",
        { body: "Are you available for a trial class?" }
      ),
      { params: { applicationId: application.id } }
    );

    mockSignedInAs(TEST_CLERK.coach);
    const listRes = await getConversations();
    const listData = await listRes.json();
    expect(listData.totalUnread).toBe(1);

    const { GET: getMessages } = await import(
      "@/app/api/applications/[applicationId]/messages/route"
    );
    await getMessages(new Request(`http://localhost/api/applications/${application.id}/messages`), {
      params: { applicationId: application.id },
    });

    const unread = await db.message.count({
      where: {
        conversation: { applicationId: application.id },
        readAt: null,
        senderUserId: { not: coachUser.id },
      },
    });
    expect(unread).toBe(0);
  });
});
