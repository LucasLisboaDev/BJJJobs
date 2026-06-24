"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  MapPin,
  Clock,
  DollarSign,
  Award,
  CheckCircle,
  Building2,
  ChevronLeft,
  Send,
} from "lucide-react";
import PublicNav from "@/components/public-nav";
import { useLanguage } from "@/components/language-provider";
import { PageShell, PageCol } from "@/components/ui/page-shell";
import { JobWorkAuthBadges, WorkAuthorizationBadge } from "@/components/work-authorization-badges";

const BELT_COLORS: Record<string, string> = {
  WHITE: "#9ca3af",
  BLUE: "#3478c8",
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
const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  REVENUE_SHARE: "Revenue share",
};

export default function JobDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const { isLoaded, isSignedIn } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [isGymAccount, setIsGymAccount] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [message, setMessage] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);

  const jobPath = typeof id === "string" ? `/jobs/${id}` : "/jobs";
  const signInUrl = `/login?redirect_url=${encodeURIComponent(jobPath)}`;

  useEffect(() => {
    if (!id) return;
    fetch(`/api/jobs/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setJob(data);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id || !isLoaded || !isSignedIn) return;
    fetch(`/api/jobs/${id}/apply`)
      .then((r) => r.json())
      .then((data) => {
        setApplied(data.applied);
        setApplicationStatus(data.application?.status ?? null);
        setIsGymAccount(!!data.isGym);
      });
  }, [id, isLoaded, isSignedIn]);

  async function handleApply() {
    setApplying(true);
    setApplyError("");
    const res = await fetch(`/api/jobs/${id}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (res.ok) {
      setApplied(true);
      setApplicationStatus("pending");
      setShowApplyForm(false);
    } else {
      const data = await res.json();
      setApplyError(
        typeof data.error === "string" ? data.error : "Something went wrong. Please try again."
      );
    }
    setApplying(false);
  }

  if (loading) {
    return (
      <PageShell className="flex items-center justify-center min-h-screen">
        <div className="text-footnote text-label-tertiary">{t("common.loading")}</div>
      </PageShell>
    );
  }

  if (!job || job.error) {
    return (
      <PageShell className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-headline mb-2">{t("jobDetail.notFound")}</div>
          <Link href="/jobs" className="text-subheadline text-brand font-semibold">
            ← {t("jobDetail.back")}
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PublicNav />
      <PageCol>
        <Link
          href="/jobs"
          className="tap inline-flex items-center gap-1.5 text-subheadline text-brand font-medium mb-5"
        >
          <ChevronLeft className="w-4 h-4" /> {t("jobDetail.back")}
        </Link>

        <div className="ios-card-lg p-5 md:p-6 mb-3.5">
          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-light flex items-center justify-center text-2xl flex-shrink-0">
              🥋
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-title-2 mb-1">{job.title}</h1>
              <div className="flex items-center gap-1.5 text-footnote text-label-secondary">
                <Building2 className="w-3.5 h-3.5" />
                {job.gym?.id ? (
                  <Link href={`/gyms/${job.gym.id}`} className="text-brand hover:underline">
                    {job.gym.name}
                  </Link>
                ) : (
                  job.gym?.name
                )}
              </div>
              <div className="flex items-center gap-1.5 text-footnote text-label-secondary mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {job.city}, {job.state}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              {job.featured && (
                <span className="chip chip-active text-[10px] mb-1.5">{t("jobs.featured")}</span>
              )}
              <div className="font-display font-bold text-lg">
                {job.minPay && job.maxPay
                  ? `$${job.minPay}–$${job.maxPay}/${job.payType === "monthly" ? "mo" : "hr"}`
                  : t("jobDetail.payNegotiable")}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="chip text-brand">{JOB_TYPE_LABELS[job.jobType]}</span>
            <span className="chip">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: BELT_COLORS[job.minBelt] }}
              />
              {BELT_LABELS[job.minBelt]}+
            </span>
            {job.minYearsTeaching > 0 && (
            <span className="chip">{job.minYearsTeaching}+ years teaching</span>
          )}
          {job.styles?.map((s: string) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {[
              { icon: Clock, label: t("jobDetail.jobType"), value: JOB_TYPE_LABELS[job.jobType] },
              { icon: Award, label: t("jobDetail.minBelt"), value: BELT_LABELS[job.minBelt] },
              {
                icon: DollarSign,
                label: t("jobDetail.pay"),
                value: job.minPay
                  ? `$${job.minPay}${job.payType === "monthly" ? "/mo" : "/hr"}+`
                  : t("jobs.negotiable"),
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-3" style={{ background: "var(--fill-quaternary)" }}>
                <div className="flex items-center gap-1 text-caption-1 text-label-tertiary mb-1">
                  <item.icon className="w-3 h-3" />
                  {item.label}
                </div>
                <div className="text-footnote font-semibold">{item.value}</div>
              </div>
            ))}
          </div>

          {!job.active && (
            <div className="rounded-[14px] py-3.5 px-4 text-subheadline text-center text-label-secondary bg-fill-tertiary mb-4">
              This position is no longer accepting applications.
            </div>
          )}

          <JobWorkAuthBadges
            workPermitRequired={!!job.workPermitRequired}
            sponsorshipAvailable={!!job.sponsorshipAvailable}
            className="mb-4"
          />

          {applied ? (
            <div className="flex flex-col items-center gap-2 rounded-[14px] py-3.5 text-subheadline font-semibold text-brand bg-brand-light">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {applicationStatus === "hired"
                  ? "You were hired for this role!"
                  : applicationStatus === "shortlisted"
                    ? "You've been shortlisted — check your dashboard"
                    : applicationStatus === "rejected"
                      ? "Application declined — browse other jobs"
                      : t("jobDetail.applied")}
              </div>
              <Link href="/dashboard" className="text-footnote font-semibold underline">
                View on dashboard →
              </Link>
            </div>
          ) : !job.active ? null : !isLoaded ? (
            <div className="text-center text-footnote text-label-tertiary py-3 ios-card">
              {t("common.loading")}
            </div>
          ) : !isSignedIn ? (
            <div>
              <Link href={signInUrl} className="btn-primary w-full block text-center">
                {t("jobDetail.signInApply")}
              </Link>
              <p className="text-caption-1 text-label-secondary text-center mt-3">
                {t("jobDetail.noAccount")}{" "}
                <Link href="/register/coach/account" className="font-semibold text-brand">
                  {t("jobDetail.createCoach")}
                </Link>
              </p>
            </div>
          ) : isGymAccount ? (
            <div className="rounded-[14px] py-3.5 px-4 text-subheadline text-center text-label-secondary bg-fill-tertiary">
              You&apos;re signed in with a gym account.{" "}
              <Link href="/dashboard" className="font-semibold text-brand">
                Go to gym dashboard
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setApplyError("");
                setShowApplyForm(true);
              }}
              className="btn-primary w-full"
            >
              {t("jobDetail.apply")}
            </button>
          )}
        </div>

        <div className="ios-card p-5 mb-3.5">
          <h2 className="text-headline mb-3">{t("jobDetail.aboutRole")}</h2>
          <p className="text-subheadline text-label-secondary leading-relaxed whitespace-pre-line">
            {job.description || t("jobDetail.noDescription")}
          </p>
        </div>

        {job.perks?.length > 0 && (
          <div className="ios-card p-5 mb-3.5">
            <h2 className="text-headline mb-3">{t("jobDetail.perks")}</h2>
            <div className="flex flex-wrap gap-2">
              {job.perks.map((perk: string) => (
                <span key={perk} className="chip text-brand">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {perk}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.gym && (
          <div className="ios-card p-5">
            <h2 className="text-headline mb-3">{t("jobDetail.aboutGym")}</h2>
            <Link href={`/gyms/${job.gym.id}`} className="flex items-center gap-3 mb-3 group tap">
              <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-lg">
                🏛️
              </div>
              <div>
                <div className="text-subheadline font-semibold text-brand group-hover:underline">
                  {job.gym.name}
                </div>
                <div className="text-caption-1 text-label-secondary">
                  {job.gym.city}, {job.gym.state}
                  {job.gym.affiliation ? ` · ${job.gym.affiliation}` : ""}
                </div>
              </div>
            </Link>
            {job.gym.description && (
              <p className="text-subheadline text-label-secondary leading-relaxed line-clamp-3">
                {job.gym.description}
              </p>
            )}
            <Link href={`/gyms/${job.gym.id}`} className="inline-block mt-3 text-footnote font-semibold text-brand">
              {t("jobDetail.viewGym")}
            </Link>
          </div>
        )}
      </PageCol>

      {/* Apply bottom sheet */}
      {showApplyForm && (
        <div className="fixed inset-0 z-[300] flex items-end justify-center">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setShowApplyForm(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-lg rounded-t-[28px] p-6 pb-8 bg-grouped-secondary sheet-up shadow-[var(--shadow-sheet)]">
            <div className="w-10 h-1 rounded-full bg-separator mx-auto mb-5" />
            <h2 className="text-title-2 mb-1">
              {t("jobDetail.apply")} — {job.title}
            </h2>
            <p className="text-footnote text-label-secondary mb-4">
              {job.gym?.name} · {job.city}, {job.state}
            </p>
            <div className="text-footnote font-semibold text-label-secondary mb-2">
              {t("jobDetail.addMessage")}
            </div>
            <textarea
              className="w-full min-h-[110px] border-none rounded-[14px] p-3.5 text-subheadline resize-none mb-4 outline-none"
              style={{ background: "var(--fill-tertiary)" }}
              placeholder={t("jobDetail.messagePlaceholder")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {applyError && (
              <div className="mb-3 px-3 py-2 rounded-xl text-footnote bg-red-50 text-red-700">
                {applyError}
                {applyError.includes("Coach profile") && (
                  <>
                    {" "}
                    <Link href="/register/coach" className="underline font-semibold">
                      Set up your coach profile
                    </Link>
                  </>
                )}
              </div>
            )}
            <div className="flex gap-2.5">
              <button type="button" onClick={() => setShowApplyForm(false)} className="btn-secondary">
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={applying}
                className="btn-primary flex-1 disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {applying ? t("jobDetail.sending") : t("jobDetail.sendApplication")}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
