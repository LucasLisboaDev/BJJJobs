import { BELT_LABELS } from "@/lib/utils";
import { getAppUrl, getFromEmail, getResend } from "./resend";
import { getUserEmail } from "./get-user-email";

type ApplicationWithRelations = {
  id: string;
  message: string | null;
  coach: {
    firstName: string;
    lastName: string;
    beltRank: string;
    specialties: string[];
    user: { clerkId: string };
  };
  job: {
    id: string;
    title: string;
    gym: { name: string; user: { clerkId: string } };
  };
};

export async function sendNewApplicationEmail(
  application: ApplicationWithRelations
): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const gymEmail = await getUserEmail(application.job.gym.user.clerkId);
  if (!gymEmail) return;

  const coachName = `${application.coach.firstName} ${application.coach.lastName}`;
  const belt = BELT_LABELS[application.coach.beltRank] ?? application.coach.beltRank;
  const appUrl = getAppUrl();
  const dashboardUrl = `${appUrl}/dashboard`;

  await resend.emails.send({
    from: getFromEmail(),
    to: gymEmail,
    subject: `New application for ${application.job.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">New application received</h2>
        <p><strong>${coachName}</strong> (${belt}) applied to your listing <strong>${application.job.title}</strong>.</p>
        ${application.message ? `<p style="color: #555; border-left: 3px solid #3478c8; padding-left: 12px;">"${application.message}"</p>` : ""}
        ${application.coach.specialties.length > 0 ? `<p>Specialties: ${application.coach.specialties.join(", ")}</p>` : ""}
        <p><a href="${dashboardUrl}" style="display: inline-block; background: #3478c8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Review applicants</a></p>
        <p style="color: #999; font-size: 12px;">BJJJobs — The job board for BJJ coaches</p>
      </div>
    `,
  });
}

export async function sendApplicationViewedEmail(
  application: ApplicationWithRelations
): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const coachEmail = await getUserEmail(application.coach.user.clerkId);
  if (!coachEmail) return;

  const appUrl = getAppUrl();
  const jobUrl = `${appUrl}/jobs/${application.job.id}`;

  await resend.emails.send({
    from: getFromEmail(),
    to: coachEmail,
    subject: `${application.job.gym.name} viewed your application`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Your application was viewed</h2>
        <p><strong>${application.job.gym.name}</strong> reviewed your application for <strong>${application.job.title}</strong>.</p>
        <p>They may reach out soon — keep an eye on your dashboard for updates.</p>
        <p><a href="${jobUrl}" style="display: inline-block; background: #3478c8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">View job listing</a></p>
        <p style="color: #999; font-size: 12px;">BJJJobs — The job board for BJJ coaches</p>
      </div>
    `,
  });
}

export async function sendApplicationStatusEmail(
  application: ApplicationWithRelations,
  status: string
): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  if (status !== "shortlisted" && status !== "rejected") return;

  const coachEmail = await getUserEmail(application.coach.user.clerkId);
  if (!coachEmail) return;

  const appUrl = getAppUrl();
  const jobUrl = `${appUrl}/jobs/${application.job.id}`;
  const dashboardUrl = `${appUrl}/dashboard`;

  const isShortlisted = status === "shortlisted";
  const subject = isShortlisted
    ? `You've been shortlisted for ${application.job.title}`
    : `Update on your application for ${application.job.title}`;

  const headline = isShortlisted ? "You've been shortlisted!" : "Application update";
  const body = isShortlisted
    ? `<strong>${application.job.gym.name}</strong> shortlisted you for <strong>${application.job.title}</strong>. They may contact you directly to discuss next steps.`
    : `<strong>${application.job.gym.name}</strong> has decided not to move forward with your application for <strong>${application.job.title}</strong> at this time. Don't get discouraged — keep applying to other positions.`;

  await resend.emails.send({
    from: getFromEmail(),
    to: coachEmail,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">${headline}</h2>
        <p>${body}</p>
        <p><a href="${isShortlisted ? jobUrl : dashboardUrl}" style="display: inline-block; background: #3478c8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">${isShortlisted ? "View job listing" : "Browse more jobs"}</a></p>
        <p style="color: #999; font-size: 12px;">BJJJobs — The job board for BJJ coaches</p>
      </div>
    `,
  });
}
