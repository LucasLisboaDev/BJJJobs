"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Shield,
  Briefcase,
  Users,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
  Plus,
  MapPin,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

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
const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  REVENUE_SHARE: "Revenue share",
};

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  pending: { label: "Pending", icon: AlertCircle, color: "#92400e", bg: "#fef3c7" },
  shortlisted: { label: "Shortlisted", icon: CheckCircle, color: "#0F6E56", bg: "#E1F5EE" },
  rejected: { label: "Rejected", icon: XCircle, color: "#991b1b", bg: "#fee2e2" },
};

// ─── Gym Dashboard ────────────────────────────────────────────────────────────

function GymDashboard({ gym }: { gym: any }) {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Record<string, any[]>>({});
  const [loadingApplicants, setLoadingApplicants] = useState<Record<string, boolean>>({});
  const [togglingJob, setTogglingJob] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>(gym.jobs ?? []);

  const totalApplicants = jobs.reduce((sum: number, j: any) => sum + (j._count?.applications ?? 0), 0);
  const activeJobs = jobs.filter((j: any) => j.active).length;

  async function loadApplicants(jobId: string) {
    if (applicants[jobId]) {
      setExpandedJob(expandedJob === jobId ? null : jobId);
      return;
    }
    setLoadingApplicants((prev) => ({ ...prev, [jobId]: true }));
    setExpandedJob(jobId);
    const res = await fetch(`/api/jobs/${jobId}/applications`);
    const data = await res.json();
    setApplicants((prev) => ({ ...prev, [jobId]: Array.isArray(data) ? data : [] }));
    setLoadingApplicants((prev) => ({ ...prev, [jobId]: false }));
  }

  async function toggleActive(job: any) {
    setTogglingJob(job.id);
    await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !job.active }),
    });
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, active: !j.active } : j))
    );
    setTogglingJob(null);
  }

  async function updateStatus(jobId: string, applicationId: string, status: string) {
    await fetch(`/api/jobs/${jobId}/applications`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, status }),
    });
    setApplicants((prev) => ({
      ...prev,
      [jobId]: prev[jobId].map((a) =>
        a.id === applicationId ? { ...a, status } : a
      ),
    }));
  }

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-medium mb-1">{gym.name}</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {gym.city}, {gym.state}
            {gym.affiliation ? ` · ${gym.affiliation}` : ""}
          </p>
        </div>
        <Link
          href="/post-job"
          className="flex items-center gap-1.5 text-sm font-medium text-white px-4 py-2 rounded-lg"
          style={{ background: "#1D9E75" }}
        >
          <Plus className="w-4 h-4" />
          Post a job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Briefcase, label: "Total listings", value: String(jobs.length) },
          { icon: ToggleRight, label: "Active listings", value: String(activeJobs) },
          { icon: Users, label: "Total applicants", value: String(totalApplicants) },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-5">
            <stat.icon className="w-5 h-5 mb-3" style={{ color: "#1D9E75" }} />
            <div className="text-2xl font-medium">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Job listings */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-medium">Your listings</h2>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center">
          <div className="text-sm text-gray-500 mb-4">No listings yet.</div>
          <Link
            href="/post-job"
            className="text-sm font-medium text-white px-5 py-2.5 rounded-lg"
            style={{ background: "#1D9E75" }}
          >
            Post your first job
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map((job: any) => {
            const isExpanded = expandedJob === job.id;
            const jobApplicants = applicants[job.id] ?? [];
            const appCount = job._count?.applications ?? 0;

            return (
              <div
                key={job.id}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden"
              >
                {/* Job row */}
                <div className="p-4 flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: "#E1F5EE" }}
                  >
                    🥋
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm">{job.title}</span>
                      {!job.active && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {job.city}, {job.state} · {JOB_TYPE_LABELS[job.jobType]}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-500">
                      {appCount} {appCount === 1 ? "applicant" : "applicants"}
                    </span>
                    <button
                      onClick={() => toggleActive(job)}
                      disabled={togglingJob === job.id}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 disabled:opacity-50"
                    >
                      {job.active ? (
                        <ToggleRight className="w-5 h-5" style={{ color: "#1D9E75" }} />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                      )}
                      {job.active ? "Active" : "Inactive"}
                    </button>
                    {appCount > 0 && (
                      <button
                        onClick={() => loadApplicants(job.id)}
                        className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:border-green-300"
                      >
                        View applicants
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Applicants panel */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4">
                    {loadingApplicants[job.id] ? (
                      <div className="text-xs text-gray-400 py-4 text-center">
                        Loading applicants...
                      </div>
                    ) : jobApplicants.length === 0 ? (
                      <div className="text-xs text-gray-400 py-4 text-center">
                        No applications yet.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {jobApplicants.map((app: any) => {
                          const statusCfg =
                            STATUS_CONFIG[app.status] ?? STATUS_CONFIG.pending;
                          const StatusIcon = statusCfg.icon;

                          return (
                            <div
                              key={app.id}
                              className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-3"
                            >
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 font-medium"
                                style={{ background: "#E1F5EE", color: "#0F6E56" }}
                              >
                                {app.coach.firstName[0]}
                                {app.coach.lastName[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Link
                                    href={`/coaches/${app.coach.id}`}
                                    className="text-sm font-medium hover:underline"
                                    style={{ color: "#0F6E56" }}
                                  >
                                    {app.coach.firstName} {app.coach.lastName}
                                  </Link>
                                  <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <span
                                      className="w-2 h-2 rounded-full inline-block"
                                      style={{
                                        background:
                                          BELT_COLORS[app.coach.beltRank] ?? "#9ca3af",
                                      }}
                                    />
                                    {BELT_LABELS[app.coach.beltRank]}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    · {app.coach.yearsTeaching}yr exp
                                  </span>
                                </div>
                                {app.coach.specialties?.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {app.coach.specialties.slice(0, 3).map((s: string) => (
                                      <span
                                        key={s}
                                        className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
                                      >
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {app.message && (
                                  <p className="text-xs text-gray-500 italic leading-relaxed line-clamp-2">
                                    "{app.message}"
                                  </p>
                                )}
                                <div className="text-xs text-gray-400 mt-1.5">
                                  Applied{" "}
                                  {new Date(app.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <span
                                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
                                  style={{
                                    background: statusCfg.bg,
                                    color: statusCfg.color,
                                  }}
                                >
                                  <StatusIcon className="w-3 h-3" />
                                  {statusCfg.label}
                                </span>
                                {app.status === "pending" && (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() =>
                                        updateStatus(job.id, app.id, "shortlisted")
                                      }
                                      className="text-xs px-2 py-1 rounded-lg font-medium"
                                      style={{ background: "#E1F5EE", color: "#0F6E56" }}
                                    >
                                      Shortlist
                                    </button>
                                    <button
                                      onClick={() =>
                                        updateStatus(job.id, app.id, "rejected")
                                      }
                                      className="text-xs px-2 py-1 rounded-lg font-medium bg-red-50 text-red-700"
                                    >
                                      Decline
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Coach Dashboard ──────────────────────────────────────────────────────────

function CoachDashboard({ coach }: { coach: any }) {
  const applications = coach.applications ?? [];
  const pending = applications.filter((a: any) => a.status === "pending").length;
  const shortlisted = applications.filter((a: any) => a.status === "shortlisted").length;

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-medium mb-1">
            {coach.firstName} {coach.lastName}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ background: BELT_COLORS[coach.beltRank] ?? "#9ca3af" }}
            />
            {BELT_LABELS[coach.beltRank]}
            {coach.affiliation ? ` · ${coach.affiliation}` : ""}
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/coaches/${coach.id}`}
            className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200"
          >
            View profile
          </Link>
          <Link
            href="/jobs"
            className="text-sm font-medium text-white px-4 py-2 rounded-lg"
            style={{ background: "#1D9E75" }}
          >
            Browse jobs
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Briefcase, label: "Applications sent", value: String(applications.length) },
          { icon: AlertCircle, label: "Pending review", value: String(pending) },
          { icon: CheckCircle, label: "Shortlisted", value: String(shortlisted) },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-5">
            <stat.icon className="w-5 h-5 mb-3" style={{ color: "#1D9E75" }} />
            <div className="text-2xl font-medium">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Applications list */}
      <h2 className="font-medium mb-4">Your applications</h2>

      {applications.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center">
          <div className="text-sm text-gray-500 mb-4">
            You haven&apos;t applied to any jobs yet.
          </div>
          <Link
            href="/jobs"
            className="text-sm font-medium text-white px-5 py-2.5 rounded-lg"
            style={{ background: "#1D9E75" }}
          >
            Browse open positions
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {applications.map((app: any) => {
            const statusCfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.pending;
            const StatusIcon = statusCfg.icon;

            return (
              <Link
                key={app.id}
                href={`/jobs/${app.job.id}`}
                className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:border-green-300 transition-colors"
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
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Root dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    const res = await fetch("/api/dashboard");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2 text-base font-medium">
          <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
          BJJJobs
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/jobs" className="text-sm text-gray-500 hover:text-gray-900">
            Browse jobs
          </Link>
        </div>
      </nav>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-sm text-gray-400">Loading dashboard...</div>
        </div>
      ) : !data || data.error ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">Something went wrong</div>
            <p className="text-sm text-gray-500">Please try refreshing the page.</p>
          </div>
        </div>
      ) : data.gym ? (
        <GymDashboard gym={data.gym} />
      ) : data.coach ? (
        <CoachDashboard coach={data.coach} />
      ) : (
        /* New user — no profile yet */
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <div className="text-3xl mb-4">🥋</div>
          <h1 className="text-xl font-medium mb-2">Welcome to BJJJobs</h1>
          <p className="text-sm text-gray-500 mb-8">
            Set up your profile to get started — are you a coach looking for work, or a
            gym looking to hire?
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/register/coach"
              className="text-sm font-medium text-white px-6 py-3 rounded-xl"
              style={{ background: "#1D9E75" }}
            >
              I&apos;m a coach
            </Link>
            <Link
              href="/register/gym"
              className="text-sm font-medium px-6 py-3 rounded-xl border border-gray-200"
            >
              I&apos;m a gym
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
