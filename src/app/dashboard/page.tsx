"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Briefcase, CheckCircle, AlertCircle, PartyPopper } from "lucide-react";
import GymDashboard from "@/components/gym-dashboard";
import { CoachApplicationCard } from "@/components/coach-application-card";
import { useLanguage } from "@/components/language-provider";
import { DashboardNav } from "@/components/ui/dashboard-nav";
import { PageShell } from "@/components/ui/page-shell";
import { BELT_COLORS, BELT_LABELS } from "@/lib/utils";
import { readStored, STORAGE_KEYS } from "@/lib/brand";
import { ProfilePhotoUpload } from "@/components/profile-photo-upload";
import { CoachLocationFields } from "@/components/coach-location-fields";
import {
  coachLocationFromData,
  coachLocationToPayload,
  formatCoachLocation,
  validateCoachLocation,
  type CoachLocationInput,
} from "@/lib/coach-location";
import { WORK_AUTH_STATUSES, type WorkAuthorizationStatus } from "@/lib/work-authorization";
import { WorkAuthorizationBadge } from "@/components/work-authorization-badges";
import { DashboardTabBar } from "@/components/dashboard-tab-bar";
import { DashboardMessages } from "@/components/dashboard-messages";
import { useDashboardTab } from "@/hooks/use-dashboard-tab";

function CoachDashboardInner() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const highlightApplicationId = searchParams.get("application");
  const { activeTab, applicationId, setTab, setSelectedApplication } = useDashboardTab();
  const [unreadCount, setUnreadCount] = useState(0);
  const [coach, setCoach] = useState<any>(null);
  const [location, setLocation] = useState<CoachLocationInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "shortlisted" | "rejected" | "hired">(
    "all"
  );

  const fetchCoach = useCallback(async () => {
    const res = await fetch("/api/dashboard");
    const json = await res.json();
    if (json.coach) {
      let coachData = json.coach;

      const pendingPhoto = readStored("pendingCoachPhoto");
      if (!coachData.photoUrl && pendingPhoto) {
        const patchRes = await fetch("/api/coach", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photoUrl: pendingPhoto }),
        });
        if (patchRes.ok) {
          coachData = await patchRes.json();
          sessionStorage.removeItem(STORAGE_KEYS.pendingCoachPhoto);
        }
      }

      setCoach(coachData);
      setLocation(coachLocationFromData(coachData));
    }
    setLoading(false);
  }, []);

  async function handleWorkAuthChange(status: WorkAuthorizationStatus | "") {
    const res = await fetch("/api/coach", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workAuthorizationStatus: status || null,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCoach((prev: any) => ({
        ...prev,
        workAuthorizationStatus: updated.workAuthorizationStatus,
      }));
    }
  }

  async function handlePhotoChange(photoUrl: string | null) {
    const res = await fetch("/api/coach", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoUrl }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCoach((prev: any) => ({ ...prev, photoUrl: updated.photoUrl }));
      if (photoUrl) {
        sessionStorage.setItem(STORAGE_KEYS.pendingCoachPhoto, photoUrl);
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.pendingCoachPhoto);
      }
    }
  }

  async function handleLocationUpdate(next: CoachLocationInput) {
    setLocation(next);

    const validationError = validateCoachLocation(next, {
      us: t("dashboard.locationValidationUS"),
      international: t("dashboard.locationValidationIntl"),
    });
    if (validationError) return;

    const res = await fetch("/api/coach", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coachLocationToPayload(next)),
    });
    if (res.ok) {
      const updated = await res.json();
      setCoach((prev: any) => ({
        ...prev,
        locationType: updated.locationType,
        city: updated.city,
        state: updated.state,
        country: updated.country,
      }));
    }
  }

  useEffect(() => {
    fetchCoach();
    const interval = setInterval(fetchCoach, 20000);
    return () => clearInterval(interval);
  }, [fetchCoach]);

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

  if (loading || !coach) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-footnote text-label-tertiary">{t("dashboard.loading")}</div>
      </div>
    );
  }

  const applications = coach.applications ?? [];
  const pending = applications.filter((a: any) => a.status === "pending").length;
  const shortlisted = applications.filter((a: any) => a.status === "shortlisted").length;
  const rejected = applications.filter((a: any) => a.status === "rejected").length;
  const hired = applications.filter((a: any) => a.status === "hired").length;

  const filteredApps =
    filter === "all" ? applications : applications.filter((a: any) => a.status === filter);

  const FILTER_TABS = [
    { key: "all" as const, label: "All", count: applications.length },
    { key: "pending" as const, label: "Pending", count: pending },
    { key: "shortlisted" as const, label: "Shortlisted", count: shortlisted },
    { key: "hired" as const, label: "Hired", count: hired },
    { key: "rejected" as const, label: "Declined", count: rejected },
  ];

  return (
    <div className="page-col !pt-6">
      <div className="ios-card-lg p-5 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 flex-1">
            <ProfilePhotoUpload
              kind="photo"
              value={coach.photoUrl}
              onChange={handlePhotoChange}
              alt={`${coach.firstName} ${coach.lastName}`}
              fallback={
                <>
                  {coach.firstName[0]}
                  {coach.lastName[0]}
                </>
              }
              label=""
              hint="Optional · visible to gyms reviewing your applications"
            />
            <div>
              <h1 className="text-title-2 mb-1">
                {coach.firstName} {coach.lastName}
              </h1>
              <div className="flex items-center gap-2 text-footnote text-label-secondary">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: BELT_COLORS[coach.beltRank] ?? "#9ca3af" }}
                />
                {BELT_LABELS[coach.beltRank]}
                {coach.affiliation ? ` · ${coach.affiliation}` : ""}
              </div>
              {coach.workAuthorizationStatus && (
                <div className="mt-2">
                  <WorkAuthorizationBadge status={coach.workAuthorizationStatus} />
                </div>
              )}
              {formatCoachLocation(coach) && (
                <div className="mt-2 text-footnote text-label-secondary">
                  {t("dashboard.currentLocation")}: {formatCoachLocation(coach)}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap sm:pt-1">
            <Link href={`/coaches/${coach.id}`} className="btn-secondary text-sm !py-2">
              {t("dashboard.viewProfile")}
            </Link>
            <Link href="/jobs" className="btn-primary text-sm !py-2">
              {t("dashboard.browseJobs")}
            </Link>
          </div>
        </div>
      </div>

      <DashboardTabBar
        activeTab={activeTab}
        unreadCount={unreadCount}
        onTabChange={setTab}
      />

      {activeTab === "messages" ? (
        <DashboardMessages
          viewerRole="coach"
          selectedApplicationId={applicationId ?? highlightApplicationId}
          onSelectApplication={setSelectedApplication}
          onUnreadChange={setUnreadCount}
        />
      ) : (
        <>
      <div className="ios-card-lg p-5 mb-5">
        <h2 className="text-headline mb-1">{t("dashboard.currentLocation")}</h2>
        <p className="text-footnote text-label-secondary mb-4">{t("dashboard.currentLocationHint")}</p>
        {location && (
          <CoachLocationFields value={location} onChange={handleLocationUpdate} />
        )}
      </div>

      <div className="ios-card-lg p-5 mb-5">
        <h2 className="text-headline mb-1">
          {t("workAuth.coachLabel")}{" "}
          <span className="font-normal text-label-tertiary text-subheadline">
            ({t("common.optional")})
          </span>
        </h2>
        <p className="text-footnote text-label-secondary mb-4">{t("workAuth.coachOptionalHint")}</p>
        <select
          className="ios-field w-full max-w-md text-sm"
          value={coach.workAuthorizationStatus ?? ""}
          onChange={(e) => handleWorkAuthChange(e.target.value as WorkAuthorizationStatus | "")}
        >
          <option value="">{t("workAuth.coachSelectPlaceholder")}</option>
          {WORK_AUTH_STATUSES.map((status) => (
            <option key={status} value={status}>
              {t(`workAuth.status.${status}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        {[
          { icon: Briefcase, label: t("dashboard.applicationsSent"), value: applications.length },
          { icon: AlertCircle, label: t("dashboard.pendingReview"), value: pending },
          { icon: CheckCircle, label: t("dashboard.shortlisted"), value: shortlisted },
          { icon: PartyPopper, label: "Hired", value: hired },
        ].map((stat) => (
          <div key={stat.label} className="stat-cell !py-4">
            <stat.icon className="w-5 h-5 mb-2 text-brand mx-auto" />
            <div className="font-display font-bold text-2xl">{stat.value}</div>
            <div className="text-caption-1 text-label-secondary mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-headline mb-3">{t("dashboard.yourApplications")}</h2>

      {applications.length === 0 ? (
        <div className="ios-card-lg p-10 text-center">
          <div className="text-subheadline text-label-secondary mb-4">
            {t("dashboard.noApplications")}
          </div>
          <Link href="/jobs" className="btn-primary">
            {t("dashboard.browseOpen")}
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {FILTER_TABS.filter((tab) => tab.key === "all" || tab.count > 0).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={`chip-toggle text-sm ${filter === tab.key ? "chip-toggle-active" : ""}`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            {filteredApps.map((app: any) => (
              <CoachApplicationCard
                key={app.id}
                app={app}
                defaultOpen={highlightApplicationId === app.id}
              />
            ))}
          </div>
        </>
      )}
        </>
      )}
    </div>
  );
}

function CoachDashboard() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-16 text-footnote text-label-tertiary">Loading...</div>
      }
    >
      <CoachDashboardInner />
    </Suspense>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  const fetchDashboard = useCallback(async () => {
    const res = await fetch("/api/dashboard");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (loading || !data || data.error) return;
    if (data.gym || data.coach) return;

    const storedRole = readStored("signupRole");
    const intendedRole = data.intendedRole ?? storedRole;

    if (intendedRole === "GYM") {
      setRedirecting(true);
      router.replace("/register/gym");
    } else if (intendedRole === "COACH") {
      setRedirecting(true);
      router.replace("/register/coach");
    }
  }, [data, loading, router]);

  return (
    <PageShell>
      <DashboardNav showPostJob={data?.role === "GYM" && !!data?.gym} />

      {loading || redirecting ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-footnote text-label-tertiary">{t("dashboard.loading")}</div>
        </div>
      ) : !data || data.error ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center ios-card-lg p-8">
            <div className="text-headline mb-2">{t("dashboard.errorTitle")}</div>
            <p className="text-footnote text-label-secondary">{t("dashboard.errorSub")}</p>
          </div>
        </div>
      ) : data.role === "GYM" && data.gym ? (
        <Suspense
          fallback={
            <div className="text-center py-16 text-footnote text-label-tertiary">Loading...</div>
          }
        >
          <GymDashboard gym={data.gym} />
        </Suspense>
      ) : data.role === "COACH" && data.coach ? (
        <CoachDashboard />
      ) : (
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <div className="text-4xl mb-4">🥋</div>
          <h1 className="text-title-2 mb-2">{t("dashboard.welcomeTitle")}</h1>
          <p className="text-subheadline text-label-secondary mb-8">{t("dashboard.welcomeSub")}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/register" className="btn-primary">
              {t("dashboard.createAccount")}
            </Link>
            <Link href="/login" className="btn-secondary">
              {t("dashboard.signIn")}
            </Link>
          </div>
        </div>
      )}
    </PageShell>
  );
}
