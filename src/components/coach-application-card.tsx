"use client";
import { useState } from "react";
import Link from "next/link";
import { Clock, ChevronDown, ChevronUp, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { ApplicationChat } from "@/components/application-chat";
import { JOB_TYPE_LABELS } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  pending: { label: "Pending", icon: AlertCircle, color: "#92400e", bg: "#fef3c7" },
  shortlisted: { label: "Shortlisted", icon: CheckCircle, color: "#0F6E56", bg: "#E1F5EE" },
  rejected: { label: "Rejected", icon: XCircle, color: "#991b1b", bg: "#fee2e2" },
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
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: "#E1F5EE" }}
        >
          🥋
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm mb-0.5">{app.job.title}</div>
          <div className="text-xs text-gray-500">
            {app.job.gym?.name} · {app.job.city}, {app.job.state}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              style={{ background: "#E1F5EE", color: "#0F6E56" }}
            >
              {JOB_TYPE_LABELS[app.job.jobType]}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: statusCfg.bg, color: statusCfg.color }}
          >
            <StatusIcon className="w-3 h-3" />
            {statusCfg.label}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {new Date(app.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {open && (
        <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50">
          {app.message && (
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="text-xs font-medium text-gray-500 mb-1">Your cover message</div>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                &ldquo;{app.message}&rdquo;
              </p>
            </div>
          )}

          <Link
            href={`/jobs/${app.job.id}`}
            className="inline-block text-xs font-medium hover:underline"
            style={{ color: "#1D9E75" }}
          >
            View job listing →
          </Link>

          <ApplicationChat applicationId={app.id} viewerRole="coach" />
        </div>
      )}
    </div>
  );
}
