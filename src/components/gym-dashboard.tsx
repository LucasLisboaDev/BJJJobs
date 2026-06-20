"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
  Plus,
  MapPin,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  Globe,
  ExternalLink,
  Pencil,
  Eye,
} from "lucide-react";
import { US_STATES } from "@/lib/utils";
import { CoachExperienceSection } from "@/components/coach-experience-section";

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

function GymProfilePanel({
  gym,
  onUpdate,
}: {
  gym: any;
  onUpdate: (updated: any) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(gym.name);
  const [city, setCity] = useState(gym.city);
  const [state, setState] = useState(gym.state);
  const [affiliation, setAffiliation] = useState(gym.affiliation ?? "");
  const [website, setWebsite] = useState(gym.website ?? "");
  const [description, setDescription] = useState(gym.description ?? "");

  function startEdit() {
    setName(gym.name);
    setCity(gym.city);
    setState(gym.state);
    setAffiliation(gym.affiliation ?? "");
    setWebsite(gym.website ?? "");
    setDescription(gym.description ?? "");
    setError("");
    setEditing(true);
  }

  async function handleSave() {
    if (!name || !city || !state) {
      setError("Name, city, and state are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/gym", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          city,
          state,
          affiliation: affiliation || undefined,
          website: website || undefined,
          description: description || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onUpdate({ ...gym, ...data });
        setEditing(false);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-medium">Edit gym profile</h2>
          <button
            onClick={() => setEditing(false)}
            className="text-xs text-gray-500 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ background: "#FCEBEB", color: "#A32D2D" }}
          >
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Gym name</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">City</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">State</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 bg-white"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                {US_STATES.map((s) => (
                  <option key={s.abbr} value={s.abbr}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Affiliation</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
              placeholder="e.g. Alliance, Gracie Barra..."
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Website</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
              placeholder="https://yourgym.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">About your gym</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 resize-none"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full text-sm font-medium text-white py-2.5 rounded-lg disabled:opacity-60"
            style={{ background: "#1D9E75" }}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-5">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: "#E1F5EE" }}
        >
          🏛️
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-medium mb-1">{gym.name}</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {gym.city}, {gym.state}
          </p>
          {gym.affiliation && (
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5" />
              {gym.affiliation}
            </p>
          )}
          {gym.website && (
            <a
              href={gym.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm mt-2 hover:underline"
              style={{ color: "#1D9E75" }}
            >
              <Globe className="w-3.5 h-3.5" />
              {gym.website.replace(/^https?:\/\//, "")}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {gym.description && (
        <p className="text-sm text-gray-600 leading-relaxed mb-5 whitespace-pre-line">
          {gym.description}
        </p>
      )}

      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={startEdit}
          className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 hover:border-green-300"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit profile
        </button>
        <Link
          href={`/gyms/${gym.id}`}
          className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg"
          style={{ background: "#E1F5EE", color: "#0F6E56" }}
        >
          <Eye className="w-3.5 h-3.5" />
          Public page
        </Link>
      </div>
    </div>
  );
}

export default function GymDashboard({ gym: initialGym }: { gym: any }) {
  const [gym, setGym] = useState(initialGym);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Record<string, any[]>>({});
  const [loadingApplicants, setLoadingApplicants] = useState<Record<string, boolean>>({});
  const [togglingJob, setTogglingJob] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>(gym.jobs ?? []);

  const totalApplicants = jobs.reduce(
    (sum: number, j: any) => sum + (j._count?.applications ?? 0),
    0
  );
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
    <div className="px-8 py-8 max-w-5xl mx-auto">
      <GymProfilePanel gym={gym} onUpdate={setGym} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 my-6">
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
        <Link
          href="/post-job"
          className="flex items-center gap-1.5 text-sm font-medium text-white px-4 py-2 rounded-lg"
          style={{ background: "#1D9E75" }}
        >
          <Plus className="w-4 h-4" />
          Post a job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center">
          <div className="text-sm text-gray-500 mb-1">No listings yet</div>
          <p className="text-xs text-gray-400 mb-4">
            Your gym profile is live. Post your first job when you&apos;re ready to hire.
          </p>
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
                <div className="p-4 flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: "#E1F5EE" }}
                  >
                    🥋
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-medium text-sm hover:underline"
                        style={{ color: "#0F6E56" }}
                      >
                        {job.title}
                      </Link>
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
                              className="bg-white border border-gray-100 rounded-xl p-4"
                            >
                              <div className="flex items-start gap-3">
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
                                    &ldquo;{app.message}&rdquo;
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
                              <CoachExperienceSection coach={app.coach} compact />
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
