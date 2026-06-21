"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  Shield,
  Briefcase,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import GymDashboard from "@/components/gym-dashboard";
import { CoachApplicationCard } from "@/components/coach-application-card";
import LanguageSwitcher from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { BELT_COLORS, BELT_LABELS } from "@/lib/utils";

function CoachDashboard({ coach }: { coach: any }) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const highlightApplicationId = searchParams.get("application");
  const applications = coach.applications ?? [];
  const pending = applications.filter((a: any) => a.status === "pending").length;
  const shortlisted = applications.filter((a: any) => a.status === "shortlisted").length;

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">
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
            {t("dashboard.viewProfile")}
          </Link>
          <Link
            href="/jobs"
            className="text-sm font-medium text-white px-4 py-2 rounded-lg"
            style={{ background: "#1D9E75" }}
          >
            {t("dashboard.browseJobs")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Briefcase, label: t("dashboard.applicationsSent"), value: String(applications.length) },
          { icon: AlertCircle, label: t("dashboard.pendingReview"), value: String(pending) },
          { icon: CheckCircle, label: t("dashboard.shortlisted"), value: String(shortlisted) },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-5">
            <stat.icon className="w-5 h-5 mb-3" style={{ color: "#1D9E75" }} />
            <div className="text-2xl font-medium">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <h2 className="font-medium mb-4">{t("dashboard.yourApplications")}</h2>

      {applications.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center">
          <div className="text-sm text-gray-500 mb-4">{t("dashboard.noApplications")}</div>
          <Link
            href="/jobs"
            className="text-sm font-medium text-white px-5 py-2.5 rounded-lg"
            style={{ background: "#1D9E75" }}
          >
            {t("dashboard.browseOpen")}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
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

    const storedRole = sessionStorage.getItem("bjjjobs_signup_role");
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
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2 text-base font-medium">
          <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
          BJJJobs
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/jobs" className="text-sm text-gray-500 hover:text-gray-900">
            {t("nav.browseJobs")}
          </Link>
          {data?.role === "GYM" && data?.gym && (
            <Link
              href="/post-job"
              className="text-sm font-medium text-white px-4 py-2 rounded-lg"
              style={{ background: "#1D9E75" }}
            >
              {t("nav.postJob")}
            </Link>
          )}
          <LanguageSwitcher />
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      {loading || redirecting ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-sm text-gray-400">{t("dashboard.loading")}</div>
        </div>
      ) : !data || data.error ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">{t("dashboard.errorTitle")}</div>
            <p className="text-sm text-gray-500">{t("dashboard.errorSub")}</p>
          </div>
        </div>
      ) : data.role === "GYM" && data.gym ? (
        <Suspense fallback={<div className="text-center py-16 text-sm text-gray-400">Loading...</div>}>
          <GymDashboard gym={data.gym} />
        </Suspense>
      ) : data.role === "COACH" && data.coach ? (
        <Suspense fallback={<div className="text-center py-16 text-sm text-gray-400">Loading...</div>}>
          <CoachDashboard coach={data.coach} />
        </Suspense>
      ) : (
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <div className="text-3xl mb-4">🥋</div>
          <h1 className="text-xl font-medium mb-2">{t("dashboard.welcomeTitle")}</h1>
          <p className="text-sm text-gray-500 mb-8">{t("dashboard.welcomeSub")}</p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/register"
              className="text-sm font-medium text-white px-6 py-3 rounded-xl"
              style={{ background: "#1D9E75" }}
            >
              {t("dashboard.createAccount")}
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium px-6 py-3 rounded-xl border border-gray-200"
            >
              {t("dashboard.signIn")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
