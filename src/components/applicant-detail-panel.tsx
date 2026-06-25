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
  FileDown,
  Eye,
} from "lucide-react";
import { CoachExperienceSection } from "@/components/coach-experience-section";
import { ApplicationChat } from "@/components/application-chat";
import { InstagramLink } from "@/components/instagram-link";
import { ProfileAvatar } from "@/components/profile-avatar";
import { STATUS_CONFIG } from "@/lib/application-status";
import { WorkAuthorizationBadge } from "@/components/work-authorization-badges";
import { formatCoachLocation } from "@/lib/coach-location";

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

export function ApplicantDetailPanel({
  app,
  defaultOpen = false,
  onStatusChange,
}: {
  app: any;
  jobId: string;
  defaultOpen?: boolean;
  onStatusChange: (
    applicationId: string,
    status: string,
    options?: { closeJob?: boolean }
  ) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [confirmDecline, setConfirmDecline] = useState(false);
  const [confirmHire, setConfirmHire] = useState(false);
  const [closeOnHire, setCloseOnHire] = useState(true);
  const coach = app.coach;
  const coachLocation = formatCoachLocation(coach);
  const statusCfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = statusCfg.icon;
  const isPending = app.status === "pending";
  const isShortlisted = app.status === "shortlisted";
  const canDecide = isPending || isShortlisted;

  return (
    <div className="ios-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-fill-quaternary/40 transition-colors tap"
      >
        <ProfileAvatar
          src={coach.photoUrl}
          alt={`${coach.firstName} ${coach.lastName}`}
          fallback={
            <>
              {coach.firstName[0]}
              {coach.lastName[0]}
            </>
          }
          size="sm"
          rounded="lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-headline">
              {coach.firstName} {coach.lastName}
            </span>
            <span className="flex items-center gap-1 text-caption-1 text-label-secondary">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: BELT_COLORS[coach.beltRank] ?? "#9ca3af" }}
              />
              {BELT_LABELS[coach.beltRank]}
            </span>
          </div>
          <div className="text-caption-1 text-label-secondary mt-0.5">
            Applied{" "}
            {new Date(app.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {coachLocation ? ` · ${coachLocation}` : ""}
            {coach.yearsTeaching ? ` · ${coach.yearsTeaching}yr teaching` : ""}
            {app.viewedAt ? " · Viewed" : " · New"}
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
        <div className="border-t border-separator/50 p-4 space-y-4 bg-grouped">
          {coach.resumeUrl && (
            <a
              href={coach.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-ios bg-brand-light text-brand-dark tap"
            >
              <FileDown className="w-5 h-5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-subheadline font-semibold">Download resume</div>
                <div className="text-caption-1 truncate">
                  {coach.resumeFileName ?? "Coach resume.pdf"}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 shrink-0 opacity-60" />
            </a>
          )}

          <div className="ios-card p-4 space-y-3">
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
                  {coachLocation && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Located in: {coachLocation}
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
                  {coach.instagram && (
                    <InstagramLink handle={coach.instagram} className="text-brand" />
                  )}
                  {coach.workAuthorizationStatus && (
                    <WorkAuthorizationBadge status={coach.workAuthorizationStatus} />
                  )}
                </div>
              </div>
              <Link
                href={`/coaches/${coach.id}`}
                className="flex items-center gap-1 text-caption-1 font-semibold text-brand flex-shrink-0 hover:underline"
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
                    className="text-xs px-2.5 py-0.5 rounded-capsule bg-brand-light text-brand-dark"
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

          {canDecide && !confirmDecline && !confirmHire && (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => onStatusChange(app.id, "shortlisted")}
                className="btn-primary text-sm !py-2 flex-1"
              >
                Shortlist
              </button>
              <button
                onClick={() => setConfirmHire(true)}
                className="btn-primary text-sm !py-2 flex-1 !bg-blue-600 hover:!bg-blue-700"
              >
                Mark as hired
              </button>
              <button
                onClick={() => setConfirmDecline(true)}
                className="btn-secondary text-sm !py-2 flex-1"
              >
                Decline
              </button>
            </div>
          )}

          {confirmHire && (
            <div className="ios-card p-4 space-y-3 border border-blue-200 bg-blue-50/50">
              <div className="text-subheadline font-semibold">
                Mark {coach.firstName} as hired?
              </div>
              <p className="text-footnote text-label-secondary">
                They&apos;ll receive a confirmation email. You can keep messaging to coordinate start
                date and details.
              </p>
              <label className="flex items-center gap-2 text-footnote cursor-pointer">
                <input
                  type="checkbox"
                  checked={closeOnHire}
                  onChange={(e) => setCloseOnHire(e.target.checked)}
                  className="rounded"
                />
                Close this listing (stop accepting new applications)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onStatusChange(app.id, "hired", { closeJob: closeOnHire });
                    setConfirmHire(false);
                  }}
                  className="btn-primary text-sm !py-2 flex-1 !bg-blue-600"
                >
                  Confirm hire
                </button>
                <button
                  onClick={() => setConfirmHire(false)}
                  className="btn-secondary text-sm !py-2 flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {confirmDecline && (
            <div className="ios-card p-4 space-y-3 border border-red-200 bg-red-50/50">
              <div className="text-subheadline font-semibold">
                Decline {coach.firstName}&apos;s application?
              </div>
              <p className="text-footnote text-label-secondary">
                They&apos;ll be notified by email. You can still message them if you change your
                mind later.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onStatusChange(app.id, "rejected");
                    setConfirmDecline(false);
                  }}
                  className="btn-secondary text-sm !py-2 flex-1 !text-red-700 !border-red-200"
                >
                  Yes, decline
                </button>
                <button
                  onClick={() => setConfirmDecline(false)}
                  className="btn-secondary text-sm !py-2 flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {app.status === "hired" && (
            <div className="flex items-center gap-2 text-footnote text-blue-700 bg-blue-50 rounded-ios p-3">
              <Eye className="w-4 h-4 shrink-0" />
              This coach has been marked as hired for this role.
            </div>
          )}

          <ApplicationChat applicationId={app.id} viewerRole="gym" />
        </div>
      )}
    </div>
  );
}
