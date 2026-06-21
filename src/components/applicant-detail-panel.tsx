"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Award,
  MapPin,
  Building2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { CoachExperienceSection } from "@/components/coach-experience-section";
import { ApplicationChat } from "@/components/application-chat";

const BELT_COLORS: Record<string, string> = {
  WHITE: "#9ca3af",
  BLUE: "#3b82f6",
  PURPLE: "#8b5cf6",
  BROWN: "#92400e",
  BLACK: "#1a1a1a",
};
const BELT_LABELS: Record<string, string> = {
  WHITE: "White belt",
  BLUE: "Blue belt",
  PURPLE: "Purple belt",
  BROWN: "Brown belt",
  BLACK: "Black belt",
};

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  pending: { label: "Pending", icon: AlertCircle, color: "#92400e", bg: "#fef3c7" },
  shortlisted: { label: "Shortlisted", icon: CheckCircle, color: "#0F6E56", bg: "#E1F5EE" },
  rejected: { label: "Rejected", icon: XCircle, color: "#991b1b", bg: "#fee2e2" },
};

export function ApplicantDetailPanel({
  app,
  defaultOpen = false,
  onStatusChange,
}: {
  app: any;
  jobId: string;
  defaultOpen?: boolean;
  onStatusChange: (applicationId: string, status: string) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const coach = app.coach;
  const statusCfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = statusCfg.icon;

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-sm flex-shrink-0 font-medium"
          style={{ background: "#E1F5EE", color: "#0F6E56" }}
        >
          {coach.firstName[0]}
          {coach.lastName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">
              {coach.firstName} {coach.lastName}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: BELT_COLORS[coach.beltRank] ?? "#9ca3af" }}
              />
              {BELT_LABELS[coach.beltRank]}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Applied{" "}
            {new Date(app.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {coach.yearsTeaching ? ` · ${coach.yearsTeaching}yr teaching` : ""}
          </div>
        </div>
        <span
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
          style={{ background: statusCfg.bg, color: statusCfg.color }}
        >
          <StatusIcon className="w-3 h-3" />
          {statusCfg.label}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {open && (
        <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50">
          <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium mb-1">Coach profile</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  {coach.affiliation && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {coach.affiliation}
                    </span>
                  )}
                  {coach.targetCity && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Target: {coach.targetCity}
                    </span>
                  )}
                  {coach.yearsTeaching > 0 && (
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {coach.yearsTeaching} years teaching
                    </span>
                  )}
                </div>
              </div>
              <Link
                href={`/coaches/${coach.id}`}
                className="flex items-center gap-1 text-xs font-medium flex-shrink-0 hover:underline"
                style={{ color: "#1D9E75" }}
              >
                Full profile
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {coach.specialties?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {coach.specialties.map((s: string) => (
                  <span
                    key={s}
                    className="text-xs px-2.5 py-0.5 rounded-full"
                    style={{ background: "#E1F5EE", color: "#0F6E56" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {app.message && (
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Cover message</div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  &ldquo;{app.message}&rdquo;
                </p>
              </div>
            )}

            {coach.bio && (
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Bio</div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {coach.bio}
                </p>
              </div>
            )}

            {coach.competitionRecord && (
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">Competition record</div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {coach.competitionRecord}
                </p>
              </div>
            )}

            {(coach.minPay || coach.maxPay) && (
              <div className="text-xs text-gray-500">
                Pay expectation:{" "}
                {coach.minPay && coach.maxPay
                  ? `$${coach.minPay}–$${coach.maxPay}`
                  : coach.minPay
                    ? `$${coach.minPay}+`
                    : `Up to $${coach.maxPay}`}
              </div>
            )}
          </div>

          <CoachExperienceSection coach={coach} compact />

          {app.status === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={() => onStatusChange(app.id, "shortlisted")}
                className="text-sm font-medium px-4 py-2 rounded-lg"
                style={{ background: "#E1F5EE", color: "#0F6E56" }}
              >
                Shortlist
              </button>
              <button
                onClick={() => onStatusChange(app.id, "rejected")}
                className="text-sm font-medium px-4 py-2 rounded-lg bg-red-50 text-red-700"
              >
                Decline
              </button>
            </div>
          )}

          <ApplicationChat applicationId={app.id} viewerRole="gym" />
        </div>
      )}
    </div>
  );
}
