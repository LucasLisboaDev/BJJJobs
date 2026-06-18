"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Shield, MapPin, Clock, DollarSign, Award, CheckCircle, Building2, ChevronLeft } from "lucide-react";

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
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/jobs/${id}`)
      .then((r) => r.json())
      .then((data) => { setJob(data); setLoading(false); });

    fetch(`/api/jobs/${id}/apply`)
      .then((r) => r.json())
      .then((data) => setApplied(data.applied));
  }, [id]);

  async function handleApply() {
    setApplying(true);
    const res = await fetch(`/api/jobs/${id}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (res.ok) {
      setApplied(true);
      setShowApplyForm(false);
    }
    setApplying(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!job || job.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Job not found</div>
          <Link href="/jobs" className="text-sm" style={{ color: "#1D9E75" }}>← Back to jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2 text-base font-medium">
          <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
          BJJJobs
        </Link>
        <Link href="/jobs" className="text-sm font-medium text-white px-4 py-2 rounded-lg" style={{ background: "#1D9E75" }}>
          Post a job
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/jobs" className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 hover:text-gray-900">
          <ChevronLeft className="w-4 h-4" /> Back to jobs
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
                  Featured
                </div>
              )}
              <div className="text-lg font-medium">
                {job.minPay && job.maxPay ? `$${job.minPay}–$${job.maxPay}/${job.payType === "monthly" ? "mo" : "hr"}` : "Pay negotiable"}
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
              { icon: Clock, label: "Job type", value: JOB_TYPE_LABELS[job.jobType] },
              { icon: Award, label: "Min belt", value: BELT_LABELS[job.minBelt] },
              { icon: DollarSign, label: "Pay", value: job.minPay ? `$${job.minPay}${job.payType === "monthly" ? "/mo" : "/hr"}+` : "Negotiable" },
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
              Application sent — the gym will be in touch
            </div>
          ) : showApplyForm ? (
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="text-sm font-medium mb-2">Add a message (optional)</div>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400 resize-none mb-3"
                rows={3}
                placeholder="Introduce yourself — your background, why you're interested in this gym..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="text-sm font-medium text-white px-5 py-2 rounded-lg disabled:opacity-60"
                  style={{ background: "#1D9E75" }}
                >
                  {applying ? "Sending..." : "Send application"}
                </button>
                <button
                  onClick={() => setShowApplyForm(false)}
                  className="text-sm px-5 py-2 rounded-lg border border-gray-200 text-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowApplyForm(true)}
              className="w-full text-sm font-medium text-white py-3 rounded-xl"
              style={{ background: "#1D9E75" }}
            >
              Apply for this position
            </button>
          )}
        </div>

        {/* Description */}
        <div className="bg-white border border-gray-100 rounded-2xl p-7 mb-4">
          <h2 className="font-medium mb-4">About the role</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {job.description || "No description provided."}
          </p>
        </div>

        {/* Perks */}
        {job.perks?.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-7 mb-4">
            <h2 className="font-medium mb-4">Perks & benefits</h2>
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

        {/* About the gym */}
        {job.gym && (
          <div className="bg-white border border-gray-100 rounded-2xl p-7">
            <h2 className="font-medium mb-4">About the gym</h2>
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
              View gym profile →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
