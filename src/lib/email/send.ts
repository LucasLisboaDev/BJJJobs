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
    affiliation?: string | null;
    yearsTeaching?: number;
    specialties: string[];
    targetCity?: string | null;
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
  const dashboardUrl = `${appUrl}/dashboard?job=${application.job.id}&application=${application.id}`;

  const details: string[] = [];
  if (application.coach.affiliation) details.push(`Affiliation: ${application.coach.affiliation}`);
  if (application.coach.yearsTeaching) {
    details.push(`${application.coach.yearsTeaching}+ years teaching`);
  }
  if (application.coach.targetCity) details.push(`Looking in: ${application.coach.targetCity}`);
  if (application.coach.specialties.length > 0) {
    details.push(`Specialties: ${application.coach.specialties.join(", ")}`);
  }

  await resend.emails.send({
    from: getFromEmail(),
    to: gymEmail,
    subject: `New applicant for ${application.job.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">You have a new applicant</h2>
        <p><strong>${coachName}</strong> (${belt}) applied to <strong>${application.job.title}</strong> at ${application.job.gym.name}.</p>
        ${details.length > 0 ? `<ul style="color: #555; padding-left: 18px;">${details.map((d) => `<li>${d}</li>`).join("")}</ul>` : ""}
        ${application.message ? `<p style="color: #555; border-left: 3px solid #1D9E75; padding-left: 12px; font-style: italic;">"${application.message}"</p>` : ""}
        <p>Review their full profile, resume, and work history on your dashboard. You can also message them directly on BJJJobs.</p>
        <p><a href="${dashboardUrl}" style="display: inline-block; background: #1D9E75; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">View applicant</a></p>
        <p style="color: #999; font-size: 12px;">BJJJobs — The job board for BJJ coaches</p>
      </div>
    `,
  });
}

export async function sendNewMessageEmail({
  applicationId,
  jobId,
  jobTitle,
  gymName,
  coachName,
  messageBody,
  senderRole,
  gymClerkId,
  coachClerkId,
}: {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  gymName: string;
  coachName: string;
  messageBody: string;
  senderRole: "COACH" | "GYM";
  gymClerkId: string;
  coachClerkId: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const recipientClerkId = senderRole === "COACH" ? gymClerkId : coachClerkId;
  const recipientEmail = await getUserEmail(recipientClerkId);
  if (!recipientEmail) return;

  const appUrl = getAppUrl();
  const dashboardUrl = `${appUrl}/dashboard?job=${jobId}&application=${applicationId}`;
  const senderName = senderRole === "COACH" ? coachName : gymName;
  const preview = messageBody.length > 200 ? `${messageBody.slice(0, 200)}…` : messageBody;

  await resend.emails.send({
    from: getFromEmail(),
    to: recipientEmail,
    subject: `New message from ${senderName} — ${jobTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">New message</h2>
        <p><strong>${senderName}</strong> sent you a message about <strong>${jobTitle}</strong>:</p>
        <p style="color: #555; border-left: 3px solid #1D9E75; padding-left: 12px;">"${preview}"</p>
        <p><a href="${dashboardUrl}" style="display: inline-block; background: #1D9E75; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Reply on BJJJobs</a></p>
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
  const dashboardUrl = `${appUrl}/dashboard?job=${application.job.id}&application=${application.id}`;

  await resend.emails.send({
    from: getFromEmail(),
    to: coachEmail,
    subject: `${application.job.gym.name} viewed your application`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Your application was viewed</h2>
        <p><strong>${application.job.gym.name}</strong> reviewed your application for <strong>${application.job.title}</strong>.</p>
        <p>They may reach out via messages on BJJJobs — check your dashboard.</p>
        <p><a href="${dashboardUrl}" style="display: inline-block; background: #1D9E75; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Open messages</a></p>
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
  const dashboardUrl = `${appUrl}/dashboard?job=${application.job.id}&application=${application.id}`;
  const jobsUrl = `${appUrl}/jobs`;

  const isShortlisted = status === "shortlisted";
  const subject = isShortlisted
    ? `You've been shortlisted for ${application.job.title}`
    : `Update on your application for ${application.job.title}`;

  const headline = isShortlisted ? "You've been shortlisted!" : "Application update";
  const body = isShortlisted
    ? `<strong>${application.job.gym.name}</strong> shortlisted you for <strong>${application.job.title}</strong>. Open your dashboard to message them and discuss next steps.`
    : `<strong>${application.job.gym.name}</strong> has decided not to move forward with your application for <strong>${application.job.title}</strong> at this time. Don't get discouraged — keep applying to other positions.`;

  await resend.emails.send({
    from: getFromEmail(),
    to: coachEmail,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">${headline}</h2>
        <p>${body}</p>
        <p><a href="${isShortlisted ? dashboardUrl : jobsUrl}" style="display: inline-block; background: #1D9E75; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">${isShortlisted ? "Open messages" : "Browse more jobs"}</a></p>
        <p style="color: #999; font-size: 12px;">BJJJobs — The job board for BJJ coaches</p>
      </div>
    `,
  });
}
