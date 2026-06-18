"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  Shield,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import GymDashboard from "@/components/gym-dashboard";
import { BELT_COLORS, BELT_LABELS, JOB_TYPE_LABELS } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  pending: { label: "Pending", icon: AlertCircle, color: "#92400e", bg: "#fef3c7" },
  shortlisted: { label: "Shortlisted", icon: CheckCircle, color: "#0F6E56", bg: "#E1F5EE" },
  rejected: { label: "Rejected", icon: XCircle, color: "#991b1b", bg: "#fee2e2" },
};

function CoachDashboard({ coach }: { coach: any }) {
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

export default function DashboardPage() {
  const router = useRouter();
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
            Browse jobs
          </Link>
          {data?.role === "GYM" && data?.gym && (
            <Link
              href="/post-job"
              className="text-sm font-medium text-white px-4 py-2 rounded-lg"
              style={{ background: "#1D9E75" }}
            >
              Post a job
            </Link>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      {loading || redirecting ? (
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
      ) : data.role === "GYM" && data.gym ? (
        <GymDashboard gym={data.gym} />
      ) : data.role === "COACH" && data.coach ? (
        <CoachDashboard coach={data.coach} />
      ) : (
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <div className="text-3xl mb-4">🥋</div>
          <h1 className="text-xl font-medium mb-2">Welcome to BJJJobs</h1>
          <p className="text-sm text-gray-500 mb-8">
            Sign in if you already have an account, or create one to get started.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/register"
              className="text-sm font-medium text-white px-6 py-3 rounded-xl"
              style={{ background: "#1D9E75" }}
            >
              Create an account
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium px-6 py-3 rounded-xl border border-gray-200"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
