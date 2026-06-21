"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { MapPin, Clock, DollarSign, Award, CheckCircle, Building2, ChevronLeft } from "lucide-react";
import PublicNav from "@/components/public-nav";
import { useLanguage } from "@/components/language-provider";

const BELT_COLORS: Record<string, string> = {
  WHITE: "#aaa", BLUE: "#3478c8", PURPLE: "#8b5cf6", BROWN: "#92400e", BLACK: "#1a1a1a",
};
const BELT_LABELS: Record<string, string> = {
  WHITE: "White belt", BLUE: "Blue belt", PURPLE: "Purple belt", BROWN: "Brown belt", BLACK: "Black belt",
};
const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time", PART_TIME: "Part-time", CONTRACT: "Contract", REVENUE_SHARE: "Revenue share",
};

export default function JobDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const { isLoaded, isSignedIn } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [message, setMessage] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);

  const jobPath = typeof id === "string" ? `/jobs/${id}` : "/jobs";
  const signInUrl = `/login?redirect_url=${encodeURIComponent(jobPath)}`;

  useEffect(() => {
    if (!id) return;
    fetch(`/api/jobs/${id}`)
      .then((r) => r.json())
      .then((data) => { setJob(data); setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (!id || !isLoaded || !isSignedIn) return;
    fetch(`/api/jobs/${id}/apply`)
      .then((r) => r.json())
      .then((data) => setApplied(data.applied));
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
      setShowApplyForm(false);
    } else {
      const data = await res.json();
      setApplyError(data.error || "Something went wrong. Please try again.");
    }
    setApplying(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-400">{t("common.loading")}</div>
      </div>
    );
  }

  if (!job || job.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">{t("jobDetail.notFound")}</div>
          <Link href="/jobs" className="text-sm" style={{ color: "#1D9E75" }}>
            ← {t("jobDetail.back")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/jobs" className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 hover:text-gray-900">
          <ChevronLeft className="w-4 h-4" /> {t("jobDetail.back")}
        </Link>

        {/* Header card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-7 mb-4">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: "#E1F5EE" }}>
                🥋
              </div>
              <div>
                <h1 className="text-xl font-medium mb-1">{job.title}</h1>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Building2 className="w-4 h-4" />
                  {job.gym?.id ? (
                    <Link href={`/gyms/${job.gym.id}`} className="hover:underline" style={{ color: "#0F6E56" }}>
                      {job.gym.name}
                    </Link>
                  ) : (
                    job.gym?.name
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                  <MapPin className="w-4 h-4" />
                  {job.city}, {job.state}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              {job.featured && (
                <div className="text-xs font-medium text-white px-2 py-0.5 rounded-full mb-2 inline-block" style={{ background: "#1D9E75" }}>
                  {t("jobs.featured")}
                </div>
              )}
              <div className="text-lg font-medium">
                {job.minPay && job.maxPay ? `$${job.minPay}–$${job.maxPay}/${job.payType === "monthly" ? "mo" : "hr"}` : t("jobDetail.payNegotiable")}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "#E1F5EE", color: "#0F6E56" }}>
              {JOB_TYPE_LABELS[job.jobType]}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: BELT_COLORS[job.minBelt] }} />
              {BELT_LABELS[job.minBelt]}+
            </span>
            {job.styles?.map((s: string) => (
              <span key={s} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">{s}</span>
            ))}
          </div>

          {/* Quick info row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Clock, label: t("jobDetail.jobType"), value: JOB_TYPE_LABELS[job.jobType] },
              { icon: Award, label: t("jobDetail.minBelt"), value: BELT_LABELS[job.minBelt] },
              { icon: DollarSign, label: t("jobDetail.pay"), value: job.minPay ? `$${job.minPay}${job.payType === "monthly" ? "/mo" : "/hr"}+` : t("jobs.negotiable") },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </div>
                <div className="text-sm font-medium">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Apply button */}
          {applied ? (
            <div className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium" style={{ background: "#E1F5EE", color: "#0F6E56" }}>
              <CheckCircle className="w-4 h-4" />
              {t("jobDetail.applied")}
            </div>
          ) : !isLoaded ? (
            <div className="w-full text-sm text-center text-gray-400 py-3 rounded-xl border border-gray-100">
              {t("common.loading")}
            </div>
          ) : !isSignedIn ? (
            <div>
              <Link
                href={signInUrl}
                className="block w-full text-center text-sm font-medium text-white py-3 rounded-xl"
                style={{ background: "#1D9E75" }}
              >
                {t("jobDetail.signInApply")}
              </Link>
              <p className="text-xs text-gray-500 text-center mt-3">
                {t("jobDetail.noAccount")}{" "}
                <Link href="/register/coach/account" className="font-medium" style={{ color: "#1D9E75" }}>
                  {t("jobDetail.createCoach")}
                </Link>
              </p>
            </div>
          ) : showApplyForm ? (
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="text-sm font-medium mb-2">{t("jobDetail.addMessage")}</div>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400 resize-none mb-3"
                rows={3}
                placeholder={t("jobDetail.messagePlaceholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {applyError && (
                <div className="mb-3 px-3 py-2 rounded-lg text-sm" style={{ background: "#FCEBEB", color: "#A32D2D" }}>
                  {applyError}
                  {applyError.includes("Coach profile") && (
                    <>
                      {" "}
                      <Link href="/register/coach" className="underline font-medium">
                        Set up your coach profile
                      </Link>
                    </>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="text-sm font-medium text-white px-5 py-2 rounded-lg disabled:opacity-60"
                  style={{ background: "#1D9E75" }}
                >
                  {applying ? t("jobDetail.sending") : t("jobDetail.sendApplication")}
                </button>
                <button
                  onClick={() => setShowApplyForm(false)}
                  className="text-sm px-5 py-2 rounded-lg border border-gray-200 text-gray-500"
                >
                  {t("common.cancel")}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setApplyError("");
                setShowApplyForm(true);
              }}
              className="w-full text-sm font-medium text-white py-3 rounded-xl"
              style={{ background: "#1D9E75" }}
            >
              {t("jobDetail.apply")}
            </button>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-7 mb-4">
          <h2 className="font-medium mb-4">{t("jobDetail.aboutRole")}</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {job.description || t("jobDetail.noDescription")}
          </p>
        </div>

        {job.perks?.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-7 mb-4">
            <h2 className="font-medium mb-4">{t("jobDetail.perks")}</h2>
            <div className="flex flex-wrap gap-2">
              {job.perks.map((perk: string) => (
                <span key={perk} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full" style={{ background: "#E1F5EE", color: "#0F6E56" }}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  {perk}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.gym && (
          <div className="bg-white border border-gray-100 rounded-2xl p-7">
            <h2 className="font-medium mb-4">{t("jobDetail.aboutGym")}</h2>
            <Link
              href={`/gyms/${job.gym.id}`}
              className="flex items-center gap-3 mb-3 group"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: "#E1F5EE" }}>🏛️</div>
              <div>
                <div className="font-medium text-sm group-hover:underline" style={{ color: "#0F6E56" }}>{job.gym.name}</div>
                <div className="text-xs text-gray-500">{job.gym.city}, {job.gym.state}{job.gym.affiliation ? ` · ${job.gym.affiliation}` : ""}</div>
              </div>
            </Link>
            {job.gym.description && (
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{job.gym.description}</p>
            )}
            <Link
              href={`/gyms/${job.gym.id}`}
              className="inline-block mt-3 text-sm font-medium"
              style={{ color: "#1D9E75" }}
            >
              {t("jobDetail.viewGym")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
