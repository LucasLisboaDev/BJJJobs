"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Briefcase,
  Users,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
  Plus,
  MapPin,
  Building2,
  Globe,
  ExternalLink,
  Pencil,
  Eye,
} from "lucide-react";
import { US_STATES } from "@/lib/utils";
import { ApplicantDetailPanel } from "@/components/applicant-detail-panel";

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  REVENUE_SHARE: "Revenue share",
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
      <div className="ios-card-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-headline font-semibold">Edit gym profile</h2>
          <button
            onClick={() => setEditing(false)}
            className="text-caption-1 text-label-secondary hover:text-label tap"
          >
            Cancel
          </button>
        </div>

        {error && <div className="alert-error mb-4">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="field-label">Gym name</label>
            <input className="ios-field" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">City</label>
              <input className="ios-field" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <label className="field-label">State</label>
              <select className="ios-field" value={state} onChange={(e) => setState(e.target.value)}>
                {US_STATES.map((s) => (
                  <option key={s.abbr} value={s.abbr}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="field-label">Affiliation</label>
            <input
              className="ios-field"
              placeholder="e.g. Alliance, Gracie Barra..."
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Website</label>
            <input
              className="ios-field"
              placeholder="https://yourgym.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">About your gym</label>
            <textarea
              className="ios-field resize-none"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full disabled:opacity-60">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ios-card-lg p-6">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-ios-lg flex items-center justify-center text-2xl shrink-0 bg-brand-light">
          🏛️
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-title-2 mb-1">{gym.name}</h1>
          <p className="text-subheadline text-label-secondary flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {gym.city}, {gym.state}
          </p>
          {gym.affiliation && (
            <p className="text-subheadline text-label-secondary flex items-center gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5" />
              {gym.affiliation}
            </p>
          )}
          {gym.website && (
            <a
              href={gym.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-subheadline mt-2 text-brand hover:underline tap"
            >
              <Globe className="w-3.5 h-3.5" />
              {gym.website.replace(/^https?:\/\//, "")}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {gym.description && (
        <p className="text-subheadline text-label-secondary leading-relaxed mb-5 whitespace-pre-line">
          {gym.description}
        </p>
      )}

      <div className="flex gap-2 pt-4 border-t border-separator/30 flex-wrap">
        <button
          onClick={startEdit}
          className="btn-secondary text-sm !py-2 !px-4 flex items-center gap-1.5"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit profile
        </button>
        <Link
          href={`/gyms/${gym.id}`}
          className="btn-secondary text-sm !py-2 !px-4 flex items-center gap-1.5 !bg-brand-light !text-brand-dark"
        >
          <Eye className="w-3.5 h-3.5" />
          Public page
        </Link>
      </div>
    </div>
  );
}

export default function GymDashboard({ gym: initialGym }: { gym: any }) {
  const searchParams = useSearchParams();
  const highlightJobId = searchParams.get("job");
  const [gym, setGym] = useState(initialGym);
  const [expandedJob, setExpandedJob] = useState<string | null>(highlightJobId);
  const [openApplicantId, setOpenApplicantId] = useState<string | null>(
    searchParams.get("application")
  );
  const [applicants, setApplicants] = useState<Record<string, any[]>>({});
  const [loadingApplicants, setLoadingApplicants] = useState<Record<string, boolean>>({});
  const [togglingJob, setTogglingJob] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>(gym.jobs ?? []);

  const totalApplicants = jobs.reduce(
    (sum: number, j: any) => sum + (j._count?.applications ?? 0),
    0
  );
  const activeJobs = jobs.filter((j: any) => j.active).length;

  useEffect(() => {
    if (highlightJobId) {
      loadApplicants(highlightJobId, true);
    }
    if (searchParams.get("application") && highlightJobId) {
      setOpenApplicantId(searchParams.get("application"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightJobId, searchParams]);

  async function loadApplicants(jobId: string, forceOpen = false) {
    if (applicants[jobId] && !forceOpen) {
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
    <div className="page-col !pt-6">
      <GymProfilePanel gym={gym} onUpdate={setGym} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 my-6">
        {[
          { icon: Briefcase, label: "Total listings", value: String(jobs.length) },
          { icon: ToggleRight, label: "Active listings", value: String(activeJobs) },
          { icon: Users, label: "Total applicants", value: String(totalApplicants) },
        ].map((stat) => (
          <div key={stat.label} className="stat-cell !py-4">
            <stat.icon className="w-5 h-5 mb-3 text-brand" />
            <div className="text-2xl font-medium">{stat.value}</div>
            <div className="text-footnote text-label-secondary mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Job listings */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-medium">Your listings</h2>
        <Link href="/post-job" className="btn-primary text-sm !py-2 !px-4 flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          Post a job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="ios-card-lg p-10 text-center">
          <div className="text-subheadline text-label-secondary mb-1">No listings yet</div>
          <p className="text-footnote text-label-tertiary mb-4">
            Your gym profile is live. Post your first job when you&apos;re ready to hire.
          </p>
          <Link href="/post-job" className="btn-primary text-sm">
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
                className="bg-grouped-secondary rounded-2xl overflow-hidden shadow-ios"
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-ios flex items-center justify-center text-lg shrink-0 bg-brand-light">
                    🥋
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-headline font-semibold hover:underline text-brand-dark"
                      >
                        {job.title}
                      </Link>
                      {!job.active && (
                        <span className="chip">Inactive</span>
                      )}
                    </div>
                    <div className="text-footnote text-label-secondary">
                      {job.city}, {job.state} · {JOB_TYPE_LABELS[job.jobType]}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
                    <span className="text-footnote text-label-secondary">
                      {appCount} {appCount === 1 ? "applicant" : "applicants"}
                    </span>
                    <button
                      onClick={() => toggleActive(job)}
                      disabled={togglingJob === job.id}
                      className="flex items-center gap-1.5 text-caption-1 text-label-secondary hover:text-label disabled:opacity-50 tap"
                    >
                      {job.active ? (
                        <ToggleRight className="w-5 h-5 text-brand" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-label-tertiary" />
                      )}
                      {job.active ? "Active" : "Inactive"}
                    </button>
                    {appCount > 0 && (
                      <button
                        onClick={() => loadApplicants(job.id)}
                        className="btn-secondary text-xs !py-1.5 !px-3 flex items-center gap-1"
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
                  <div className="border-t border-separator/30 bg-fill-quaternary p-4">
                    {loadingApplicants[job.id] ? (
                      <div className="text-footnote text-label-tertiary py-4 text-center">
                        Loading applicants...
                      </div>
                    ) : jobApplicants.length === 0 ? (
                      <div className="text-footnote text-label-tertiary py-4 text-center">
                        No applications yet.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {jobApplicants.map((app: any) => (
                          <ApplicantDetailPanel
                            key={app.id}
                            app={app}
                            jobId={job.id}
                            defaultOpen={openApplicantId === app.id}
                            onStatusChange={(applicationId, status) =>
                              updateStatus(job.id, applicationId, status)
                            }
                          />
                        ))}
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
