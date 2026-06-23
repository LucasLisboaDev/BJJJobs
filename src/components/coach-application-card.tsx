"use client";
import { useState } from "react";
import Link from "next/link";
import { Clock, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { ApplicationChat } from "@/components/application-chat";
import { InstagramLink } from "@/components/instagram-link";
import { JOB_TYPE_LABELS } from "@/lib/utils";
import { STATUS_CONFIG } from "@/lib/application-status";

export function CoachApplicationCard({
  app,
  defaultOpen = false,
}: {
  app: any;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const statusCfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = statusCfg.icon;

  return (
    <div className="ios-card-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3.5 p-4 text-left hover:bg-fill-quaternary/50 transition-colors tap"
      >
        <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-lg flex-shrink-0">
          🥋
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-headline truncate">{app.job.title}</div>
          <div className="text-footnote text-label-secondary">
            {app.job.gym?.name} · {app.job.city}, {app.job.state}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="chip text-brand">{JOB_TYPE_LABELS[app.job.jobType]}</span>
            {app.viewedAt && app.status === "pending" && (
              <span className="flex items-center gap-1 text-caption-1 text-label-tertiary">
                <Eye className="w-3 h-3" />
                Viewed by gym
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span
            className="flex items-center gap-1 text-caption-1 font-semibold px-2.5 py-1 rounded-capsule"
            style={{ background: statusCfg.bg, color: statusCfg.color }}
          >
            <StatusIcon className="w-3 h-3" />
            {statusCfg.label}
          </span>
          <div className="flex items-center gap-1 text-caption-1 text-label-tertiary">
            <Clock className="w-3 h-3" />
            {new Date(app.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-label-tertiary" />
        ) : (
          <ChevronDown className="w-4 h-4 text-label-tertiary" />
        )}
      </button>

      {open && (
        <div className="border-t border-separator/50 p-4 space-y-4 bg-grouped">
          {app.status === "hired" && (
            <div className="rounded-ios p-4 bg-blue-50 border border-blue-100">
              <div className="text-subheadline font-semibold text-blue-900 mb-1">
                Congratulations — you got the job!
              </div>
              <p className="text-footnote text-blue-800">
                {app.job.gym?.name} marked you as hired for this role. Message them below to
                coordinate your start date.
              </p>
            </div>
          )}

          {app.status === "shortlisted" && (
            <div className="rounded-ios p-4 bg-brand-light">
              <div className="text-subheadline font-semibold text-brand-dark mb-1">
                You&apos;re shortlisted
              </div>
              <p className="text-footnote text-label-secondary">
                The gym is interested. Send a message to introduce yourself or schedule a trial
                class.
              </p>
            </div>
          )}

          {app.status === "rejected" && (
            <div className="rounded-ios p-4 bg-red-50 border border-red-100">
              <div className="text-subheadline font-semibold text-red-900 mb-1">Not this time</div>
              <p className="text-footnote text-red-800 mb-3">
                This gym decided not to move forward. Keep applying — the right fit is out there.
              </p>
              <Link href="/jobs" className="text-footnote font-semibold text-brand">
                Browse more jobs →
              </Link>
            </div>
          )}

          {app.message && (
            <div className="ios-card p-4">
              <div className="text-caption-1 font-semibold text-label-secondary mb-1">
                Your cover message
              </div>
              <p className="text-subheadline text-label-secondary leading-relaxed whitespace-pre-line">
                &ldquo;{app.message}&rdquo;
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-footnote">
            <Link href={`/jobs/${app.job.id}`} className="font-semibold text-brand tap">
              View job listing →
            </Link>
            {app.job.gym?.id && (
              <Link href={`/gyms/${app.job.gym.id}`} className="font-semibold text-brand tap">
                View gym profile →
              </Link>
            )}
            {app.job.gym?.instagram && (
              <InstagramLink handle={app.job.gym.instagram} className="text-brand text-footnote" />
            )}
          </div>

          <ApplicationChat applicationId={app.id} viewerRole="coach" />
        </div>
      )}
    </div>
  );
}
