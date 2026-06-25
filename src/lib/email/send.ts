import { BELT_LABELS } from "@/lib/utils";
import { formatCoachLocation } from "@/lib/coach-location";
import { getAppUrl, getFromEmail, getResend, getContactToEmail } from "./resend";
import { getUserEmail } from "./get-user-email";

type ApplicationWithRelations = {
  id: string;
  message: string | null;
  coach: {
    firstName: string;
    lastName: string;
    beltRank: string;
    affiliation?: string | null;
    instagram?: string | null;
    yearsTeaching?: number;
    specialties: string[];
    targetCity?: string | null;
    locationType?: "US" | "INTERNATIONAL" | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
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
  if (application.coach.instagram) details.push(`Instagram: @${application.coach.instagram}`);
  if (application.coach.yearsTeaching) {
    details.push(`${application.coach.yearsTeaching}+ years teaching`);
  }
  const coachLocation = formatCoachLocation(application.coach);
  if (coachLocation) details.push(`Located in: ${coachLocation}`);
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
        <p>Review their full profile, resume, and work history on your dashboard. You can also message them directly on JiuJitsuJobs.</p>
        <p><a href="${dashboardUrl}" style="display: inline-block; background: #1D9E75; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">View applicant</a></p>
        <p style="color: #999; font-size: 12px;">JiuJitsuJobs — The job board for BJJ coaches</p>
      </div>
    `,
  });
}

export async function sendApplicationConfirmationEmail(
  application: ApplicationWithRelations
): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const coachEmail = await getUserEmail(application.coach.user.clerkId);
  if (!coachEmail) return;

  const appUrl = getAppUrl();
  const dashboardUrl = `${appUrl}/dashboard?tab=messages&application=${application.id}`;

  await resend.emails.send({
    from: getFromEmail(),
    to: coachEmail,
    subject: `Application sent — ${application.job.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Application sent</h2>
        <p>Your application for <strong>${application.job.title}</strong> at <strong>${application.job.gym.name}</strong> was submitted successfully.</p>
        <p>The gym will review your profile and may message you on JiuJitsuJobs. You'll get an email when they update your status.</p>
        <p><a href="${dashboardUrl}" style="display: inline-block; background: #1D9E75; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">View your applications</a></p>
        <p style="color: #999; font-size: 12px;">JiuJitsuJobs — The job board for BJJ coaches</p>
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
  const dashboardUrl = `${appUrl}/dashboard?tab=messages&job=${jobId}&application=${applicationId}`;
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
        <p><a href="${dashboardUrl}" style="display: inline-block; background: #1D9E75; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Reply on JiuJitsuJobs</a></p>
        <p style="color: #999; font-size: 12px;">JiuJitsuJobs — The job board for BJJ coaches</p>
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
  const dashboardUrl = `${appUrl}/dashboard?tab=messages&job=${application.job.id}&application=${application.id}`;

  await resend.emails.send({
    from: getFromEmail(),
    to: coachEmail,
    subject: `${application.job.gym.name} viewed your application`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Your application was viewed</h2>
        <p><strong>${application.job.gym.name}</strong> reviewed your application for <strong>${application.job.title}</strong>.</p>
        <p>They may reach out via messages on JiuJitsuJobs — check your dashboard.</p>
        <p><a href="${dashboardUrl}" style="display: inline-block; background: #1D9E75; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Open messages</a></p>
        <p style="color: #999; font-size: 12px;">JiuJitsuJobs — The job board for BJJ coaches</p>
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

  if (status !== "shortlisted" && status !== "rejected" && status !== "hired") return;

  const coachEmail = await getUserEmail(application.coach.user.clerkId);
  if (!coachEmail) return;

  const appUrl = getAppUrl();
  const dashboardUrl = `${appUrl}/dashboard?tab=messages&application=${application.id}`;
  const jobsUrl = `${appUrl}/jobs`;

  const isShortlisted = status === "shortlisted";
  const isHired = status === "hired";
  const subject = isHired
    ? `Congratulations — you were hired for ${application.job.title}!`
    : isShortlisted
      ? `You've been shortlisted for ${application.job.title}`
      : `Update on your application for ${application.job.title}`;

  const headline = isHired
    ? "You got the job!"
    : isShortlisted
      ? "You've been shortlisted!"
      : "Application update";
  const body = isHired
    ? `<strong>${application.job.gym.name}</strong> marked you as hired for <strong>${application.job.title}</strong>. Open your dashboard to coordinate next steps with the gym.`
    : isShortlisted
      ? `<strong>${application.job.gym.name}</strong> shortlisted you for <strong>${application.job.title}</strong>. Open your dashboard to message them and discuss next steps.`
      : `<strong>${application.job.gym.name}</strong> has decided not to move forward with your application for <strong>${application.job.title}</strong> at this time. Don't get discouraged — keep applying to other positions.`;

  const ctaLabel = isHired || isShortlisted ? "Open dashboard" : "Browse more jobs";
  const ctaUrl = isHired || isShortlisted ? dashboardUrl : jobsUrl;

  await resend.emails.send({
    from: getFromEmail(),
    to: coachEmail,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">${headline}</h2>
        <p>${body}</p>
        <p><a href="${ctaUrl}" style="display: inline-block; background: #1D9E75; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">${ctaLabel}</a></p>
        <p style="color: #999; font-size: 12px;">JiuJitsuJobs — The job board for BJJ coaches</p>
      </div>
    `,
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactFormEmail({
  email,
  message,
}: {
  email: string;
  message: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend) {
    throw new Error("Email service not configured");
  }

  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  await resend.emails.send({
    from: getFromEmail(),
    to: getContactToEmail(),
    replyTo: email,
    subject: `JiuJitsuJobs contact — ${email}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">New contact form message</h2>
        <p><strong>From:</strong> ${escapeHtml(email)}</p>
        <p style="color: #555; border-left: 3px solid #1D9E75; padding-left: 12px;">${safeMessage}</p>
        <p style="color: #999; font-size: 12px;">Reply directly to this email to respond to the sender.</p>
      </div>
    `,
  });
}
