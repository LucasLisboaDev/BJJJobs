"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
  CheckCircle,
  Copy,
  X,
} from "lucide-react";
import { US_STATES } from "@/lib/utils";
import { ApplicantDetailPanel } from "@/components/applicant-detail-panel";
import { InstagramLink } from "@/components/instagram-link";
import { ProfileAvatar } from "@/components/profile-avatar";
import { ProfilePhotoUpload } from "@/components/profile-photo-upload";
import { DashboardTabBar } from "@/components/dashboard-tab-bar";
import { DashboardMessages } from "@/components/dashboard-messages";
import { useDashboardTab } from "@/hooks/use-dashboard-tab";

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  REVENUE_SHARE: "Revenue share",
};

type ApplicantFilter = "all" | "pending" | "shortlisted" | "rejected" | "hired";

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
  const [logoUrl, setLogoUrl] = useState<string | null>(gym.logoUrl ?? null);
  const [city, setCity] = useState(gym.city);
  const [state, setState] = useState(gym.state);
  const [affiliation, setAffiliation] = useState(gym.affiliation ?? "");
  const [website, setWebsite] = useState(gym.website ?? "");
  const [instagram, setInstagram] = useState(gym.instagram ?? "");
  const [description, setDescription] = useState(gym.description ?? "");

  function startEdit() {
    setName(gym.name);
    setLogoUrl(gym.logoUrl ?? null);
    setCity(gym.city);
    setState(gym.state);
    setAffiliation(gym.affiliation ?? "");
    setWebsite(gym.website ?? "");
    setInstagram(gym.instagram ?? "");
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
          logoUrl,
          city,
          state,
          affiliation: affiliation || undefined,
          website: website || undefined,
          instagram: instagram || undefined,
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
          <ProfilePhotoUpload
            kind="logo"
            value={logoUrl}
            onChange={setLogoUrl}
            alt={name || "Gym logo"}
            fallback="🏛️"
            label="Gym logo"
          />
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
            <label className="field-label">Instagram</label>
            <input
              className="ios-field"
              placeholder="@yourgym or instagram.com/yourgym"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
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
        <ProfileAvatar src={gym.logoUrl} alt={gym.name} fallback="🏛️" size="md" />
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
          {gym.instagram && (
            <div className="mt-2">
              <InstagramLink handle={gym.instagram} className="text-subheadline text-brand" />
            </div>
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

function PublishedBanner({ jobId, onDismiss }: { jobId: string; onDismiss: () => void }) {
  const [copied, setCopied] = useState(false);
  const listingUrl =
    typeof window !== "undefined" ? `${window.location.origin}/jobs/${jobId}` : `/jobs/${jobId}`;

  async function copyLink() {
    await navigator.clipboard.writeText(listingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="ios-card-lg p-5 mb-6 border border-brand/30 bg-brand-light/40">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-brand shrink-0" />
          <div className="text-headline font-semibold text-brand-dark">Your listing is live!</div>
        </div>
        <button onClick={onDismiss} className="text-label-tertiary hover:text-label tap">
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-footnote text-label-secondary mb-4">
        Coaches can now find and apply to your job. Share the link or check back for applicants.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link href={`/jobs/${jobId}`} className="btn-primary text-sm !py-2">
          View listing
        </Link>
        <button onClick={copyLink} className="btn-secondary text-sm !py-2 flex items-center gap-1.5">
          <Copy className="w-3.5 h-3.5" />
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}

export default function GymDashboard({ gym: initialGym }: { gym: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const highlightJobId = searchParams.get("job");
  const publishedJobId = searchParams.get("published");
  const { activeTab, applicationId, setTab, setSelectedApplication } = useDashboardTab();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPublishedBanner, setShowPublishedBanner] = useState(!!publishedJobId);

  const [gym, setGym] = useState(initialGym);
  const [expandedJob, setExpandedJob] = useState<string | null>(highlightJobId);
  const [openApplicantId, setOpenApplicantId] = useState<string | null>(
    searchParams.get("application")
  );
  const [applicants, setApplicants] = useState<Record<string, any[]>>({});
  const [applicantFilters, setApplicantFilters] = useState<Record<string, ApplicantFilter>>({});
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

  useEffect(() => {
    async function loadUnread() {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.totalUnread ?? 0);
      }
    }
    loadUnread();
    const interval = setInterval(loadUnread, 20000);
    return () => clearInterval(interval);
  }, []);

  function dismissPublishedBanner() {
    setShowPublishedBanner(false);
    router.replace("/dashboard", { scroll: false });
  }

  function getNewApplicantCount(job: any) {
    if (!job.applications) return 0;
    return job.applications.filter((a: any) => !a.viewedAt).length;
  }

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

    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              applications: (j.applications ?? []).map((a: any) => ({ ...a, viewedAt: new Date() })),
            }
          : j
      )
    );
  }

  async function toggleActive(job: any) {
    setTogglingJob(job.id);
    const res = await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !job.active }),
    });
    if (res.ok) {
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, active: !j.active } : j))
      );
    }
    setTogglingJob(null);
  }

  async function updateStatus(
    jobId: string,
    applicationId: string,
    status: string,
    options?: { closeJob?: boolean }
  ) {
    const res = await fetch(`/api/jobs/${jobId}/applications`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, status, closeJob: options?.closeJob }),
    });
    if (res.ok) {
      const data = await res.json();
      setApplicants((prev) => ({
        ...prev,
        [jobId]: prev[jobId].map((a) =>
          a.id === applicationId ? { ...a, status: data.status } : a
        ),
      }));
      if (options?.closeJob) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, active: false } : j))
        );
      }
    }
  }

  function filterApplicants(jobId: string, list: any[]) {
    const filter = applicantFilters[jobId] ?? "all";
    if (filter === "all") return list;
    return list.filter((a) => a.status === filter);
  }

  const FILTER_TABS: { key: ApplicantFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "shortlisted", label: "Shortlisted" },
    { key: "hired", label: "Hired" },
    { key: "rejected", label: "Declined" },
  ];

  return (
    <div className="page-col !pt-6">
      {showPublishedBanner && publishedJobId && (
        <PublishedBanner jobId={publishedJobId} onDismiss={dismissPublishedBanner} />
      )}

      <GymProfilePanel gym={gym} onUpdate={setGym} />

      <DashboardTabBar
        activeTab={activeTab}
        unreadCount={unreadCount}
        onTabChange={setTab}
      />

      {activeTab === "messages" ? (
        <DashboardMessages
          viewerRole="gym"
          selectedApplicationId={applicationId ?? searchParams.get("application")}
          onSelectApplication={setSelectedApplication}
          onUnreadChange={setUnreadCount}
        />
      ) : (
        <>
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
            const filteredApplicants = filterApplicants(job.id, jobApplicants);
            const appCount = job._count?.applications ?? 0;
            const newCount = getNewApplicantCount(job);

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
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-headline font-semibold hover:underline text-brand-dark"
                      >
                        {job.title}
                      </Link>
                      {!job.active && <span className="chip">Inactive</span>}
                      {newCount > 0 && (
                        <span className="chip chip-active !bg-orange-100 !text-orange-800">
                          {newCount} new
                        </span>
                      )}
                    </div>
                    <div className="text-footnote text-label-secondary">
                      {job.city}, {job.state} · {JOB_TYPE_LABELS[job.jobType]}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                    <span className="text-footnote text-label-secondary">
                      {appCount} {appCount === 1 ? "applicant" : "applicants"}
                    </span>
                    <Link
                      href={`/post-job?edit=${job.id}`}
                      className="btn-secondary text-xs !py-1.5 !px-3 flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </Link>
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
                      <>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {FILTER_TABS.map((tab) => {
                            const count =
                              tab.key === "all"
                                ? jobApplicants.length
                                : jobApplicants.filter((a) => a.status === tab.key).length;
                            if (tab.key !== "all" && count === 0) return null;
                            const active = (applicantFilters[job.id] ?? "all") === tab.key;
                            return (
                              <button
                                key={tab.key}
                                type="button"
                                onClick={() =>
                                  setApplicantFilters((prev) => ({ ...prev, [job.id]: tab.key }))
                                }
                                className={`chip-toggle text-xs ${active ? "chip-toggle-active" : ""}`}
                              >
                                {tab.label} ({count})
                              </button>
                            );
                          })}
                        </div>
                        {filteredApplicants.length === 0 ? (
                          <div className="text-footnote text-label-tertiary py-4 text-center">
                            No applicants in this category.
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {filteredApplicants.map((app: any) => (
                              <ApplicantDetailPanel
                                key={app.id}
                                app={app}
                                jobId={job.id}
                                defaultOpen={openApplicantId === app.id}
                                onStatusChange={(applicationId, status, options) =>
                                  updateStatus(job.id, applicationId, status, options)
                                }
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
}
