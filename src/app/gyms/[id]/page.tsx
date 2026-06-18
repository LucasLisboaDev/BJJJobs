"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  MapPin,
  Building2,
  ChevronLeft,
  Globe,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { BELT_LABELS, JOB_TYPE_LABELS, formatPay } from "@/lib/utils";

export default function GymProfilePage() {
  const { id } = useParams();
  const [gym, setGym] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/gyms/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setGym(data.error ? null : data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading gym profile...</div>
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Gym not found</div>
          <Link href="/jobs" className="text-sm" style={{ color: "#1D9E75" }}>
            ← Browse jobs
          </Link>
        </div>
      </div>
    );
  }

  const activeJobs = gym.jobs ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2 text-base font-medium">
          <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
          BJJJobs
        </Link>
        <Link
          href="/jobs"
          className="text-sm font-medium text-white px-4 py-2 rounded-lg"
          style={{ background: "#1D9E75" }}
        >
          Browse jobs
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href="/jobs"
          className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4" /> Back to jobs
        </Link>

        {/* Profile header */}
        <div className="bg-white border border-gray-100 rounded-2xl p-7 mb-4">
          <div className="flex items-start gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: "#E1F5EE" }}
            >
              🏛️
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-medium mb-1">{gym.name}</h1>
              <div className="flex items-center gap-3 flex-wrap text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {gym.city}, {gym.state}
                </span>
                {gym.affiliation && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {gym.affiliation}
                  </span>
                )}
              </div>
              {gym.website && (
                <a
                  href={gym.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm mt-3 hover:underline"
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
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {gym.description}
              </p>
            </div>
          )}
        </div>

        {/* Open positions */}
        <div className="bg-white border border-gray-100 rounded-2xl p-7 mb-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4" style={{ color: "#1D9E75" }} />
              Open positions
            </h2>
            <span className="text-xs text-gray-400">
              {activeJobs.length} {activeJobs.length === 1 ? "listing" : "listings"}
            </span>
          </div>

          {activeJobs.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              No open positions right now. Check back soon.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {activeJobs.map((job: any) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-300 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: "#E1F5EE" }}
                  >
                    🥋
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-0.5">{job.title}</div>
                    <div className="text-xs text-gray-500">
                      {job.city}, {job.state} · {JOB_TYPE_LABELS[job.jobType]}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "#E1F5EE", color: "#0F6E56" }}
                      >
                        {BELT_LABELS[job.minBelt]}+
                      </span>
                      {job.styles?.slice(0, 2).map((s: string) => (
                        <span
                          key={s}
                          className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-right flex-shrink-0">
                    {formatPay(job.minPay, job.maxPay, job.payType)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-400 text-center">
          Member since{" "}
          {new Date(gym.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
