import { vi } from "vitest";

const mocks = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  sendNewApplicationEmail: vi.fn().mockResolvedValue(undefined),
  sendApplicationConfirmationEmail: vi.fn().mockResolvedValue(undefined),
  sendApplicationStatusEmail: vi.fn().mockResolvedValue(undefined),
  sendApplicationViewedEmail: vi.fn().mockResolvedValue(undefined),
  sendNewMessageEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mocks.mockAuth(),
  clerkClient: {
    users: {
      getUser: vi.fn(async (clerkId: string) => ({
        id: clerkId,
        emailAddresses: [
          {
            id: "email_primary",
            emailAddress: clerkId.includes("gym")
              ? "gym@test.jiujitsujobs.com"
              : "coach@test.jiujitsujobs.com",
          },
        ],
        primaryEmailAddressId: "email_primary",
      })),
    },
  },
}));

vi.mock("@/lib/email/send", () => ({
  sendNewApplicationEmail: mocks.sendNewApplicationEmail,
  sendApplicationConfirmationEmail: mocks.sendApplicationConfirmationEmail,
  sendApplicationStatusEmail: mocks.sendApplicationStatusEmail,
  sendApplicationViewedEmail: mocks.sendApplicationViewedEmail,
  sendNewMessageEmail: mocks.sendNewMessageEmail,
}));

export const emailMocks = {
  get sendNewApplicationEmail() {
    return mocks.sendNewApplicationEmail;
  },
  get sendApplicationConfirmationEmail() {
    return mocks.sendApplicationConfirmationEmail;
  },
  get sendApplicationStatusEmail() {
    return mocks.sendApplicationStatusEmail;
  },
  get sendApplicationViewedEmail() {
    return mocks.sendApplicationViewedEmail;
  },
  get sendNewMessageEmail() {
    return mocks.sendNewMessageEmail;
  },
};

export function mockSignedInAs(clerkId: string | null) {
  mocks.mockAuth.mockResolvedValue({ userId: clerkId });
}

export function clearEmailMocks() {
  Object.values(mocks).forEach((fn) => {
    if (typeof fn === "function" && "mockClear" in fn) {
      fn.mockClear();
    }
  });
}
