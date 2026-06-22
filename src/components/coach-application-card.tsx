"use client";
import { useState } from "react";
import Link from "next/link";
import { Clock, ChevronDown, ChevronUp, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { ApplicationChat } from "@/components/application-chat";
import { JOB_TYPE_LABELS } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  pending: { label: "Pending", icon: AlertCircle, color: "#92400e", bg: "rgba(255,149,0,0.14)" },
  shortlisted: { label: "Shortlisted", icon: CheckCircle, color: "#0F6E56", bg: "rgba(52,199,89,0.16)" },
  rejected: { label: "Rejected", icon: XCircle, color: "#991b1b", bg: "rgba(255,59,48,0.12)" },
};

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
          <span className="chip text-brand mt-2 inline-flex">
            {JOB_TYPE_LABELS[app.job.jobType]}
          </span>
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
          <Link href={`/jobs/${app.job.id}`} className="text-footnote font-semibold text-brand tap">
            View job listing →
          </Link>
          <ApplicationChat applicationId={app.id} viewerRole="coach" />
        </div>
      )}
    </div>
  );
}
