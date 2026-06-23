"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Briefcase, CheckCircle, AlertCircle } from "lucide-react";
import GymDashboard from "@/components/gym-dashboard";
import { CoachApplicationCard } from "@/components/coach-application-card";
import { useLanguage } from "@/components/language-provider";
import { DashboardNav } from "@/components/ui/dashboard-nav";
import { PageShell } from "@/components/ui/page-shell";
import { BELT_COLORS, BELT_LABELS } from "@/lib/utils";
import { readStored } from "@/lib/brand";

function CoachDashboard({ coach }: { coach: any }) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const highlightApplicationId = searchParams.get("application");
  const applications = coach.applications ?? [];
  const pending = applications.filter((a: any) => a.status === "pending").length;
  const shortlisted = applications.filter((a: any) => a.status === "shortlisted").length;

  return (
    <div className="page-col !pt-6">
      <div className="ios-card-lg p-5 mb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
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
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href={`/coaches/${coach.id}`} className="btn-secondary text-sm !py-2">
            {t("dashboard.viewProfile")}
          </Link>
          <Link href="/jobs" className="btn-primary text-sm !py-2">
            {t("dashboard.browseJobs")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {[
          { icon: Briefcase, label: t("dashboard.applicationsSent"), value: String(applications.length) },
          { icon: AlertCircle, label: t("dashboard.pendingReview"), value: String(pending) },
          { icon: CheckCircle, label: t("dashboard.shortlisted"), value: String(shortlisted) },
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
        <div className="flex flex-col gap-2.5">
          {applications.map((app: any) => (
            <CoachApplicationCard
              key={app.id}
              app={app}
              defaultOpen={highlightApplicationId === app.id}
            />
          ))}
        </div>
      )}
    </div>
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
        <Suspense
          fallback={
            <div className="text-center py-16 text-footnote text-label-tertiary">Loading...</div>
          }
        >
          <CoachDashboard coach={data.coach} />
        </Suspense>
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
