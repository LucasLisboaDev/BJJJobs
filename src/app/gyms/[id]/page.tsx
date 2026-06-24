"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Building2,
  ChevronLeft,
  Globe,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { BELT_LABELS, JOB_TYPE_LABELS, formatPay } from "@/lib/utils";
import PublicNav from "@/components/public-nav";
import { InstagramLink } from "@/components/instagram-link";
import { ProfileAvatar } from "@/components/profile-avatar";

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
      <div className="min-h-screen bg-grouped flex items-center justify-center">
        <div className="text-footnote text-label-tertiary">Loading gym profile...</div>
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="min-h-screen bg-grouped flex items-center justify-center">
        <div className="text-center">
          <div className="text-title-2 mb-2">Gym not found</div>
          <Link href="/jobs" className="text-subheadline font-semibold text-brand">
            ← Browse jobs
          </Link>
        </div>
      </div>
    );
  }

  const activeJobs = gym.jobs ?? [];

  return (
    <div className="min-h-screen bg-grouped">
      <PublicNav />

      <div className="page-col max-w-3xl">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-subheadline text-label-secondary hover:text-label mb-6 tap"
        >
          <ChevronLeft className="w-4 h-4" /> Back to jobs
        </Link>

        <div className="ios-card-lg p-7 mb-4">
          <div className="flex items-start gap-5">
            <ProfileAvatar src={gym.logoUrl} alt={gym.name} fallback="🏛️" size="lg" />
            <div className="flex-1 min-w-0">
              <h1 className="text-title-2 mb-1">{gym.name}</h1>
              <div className="flex items-center gap-3 flex-wrap text-subheadline text-label-secondary">
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
                  className="inline-flex items-center gap-1 text-subheadline mt-3 text-brand hover:underline tap"
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
            <div className="mt-6 pt-6 border-t border-separator/30">
              <p className="text-subheadline text-label-secondary leading-relaxed whitespace-pre-line">
                {gym.description}
              </p>
            </div>
          )}
        </div>

        <div className="ios-card-lg p-7 mb-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-headline font-semibold flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand" />
              Open positions
            </h2>
            <span className="text-footnote text-label-tertiary">
              {activeJobs.length} {activeJobs.length === 1 ? "listing" : "listings"}
            </span>
          </div>

          {activeJobs.length === 0 ? (
            <p className="text-subheadline text-label-secondary py-4 text-center">
              No open positions right now. Check back soon.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {activeJobs.map((job: any) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center gap-4 p-4 rounded-ios bg-fill-tertiary/50 hover:bg-fill-tertiary transition-colors tap"
                >
                  <div className="w-10 h-10 rounded-ios flex items-center justify-center text-lg shrink-0 bg-brand-light">
                    🥋
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-headline font-semibold mb-0.5">{job.title}</div>
                    <div className="text-footnote text-label-secondary">
                      {job.city}, {job.state} · {JOB_TYPE_LABELS[job.jobType]}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="chip chip-active !bg-brand-light !text-brand-dark">
                        {BELT_LABELS[job.minBelt]}+
                      </span>
                      {job.styles?.slice(0, 2).map((s: string) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-subheadline font-semibold text-right shrink-0">
                    {formatPay(job.minPay, job.maxPay, job.payType)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="text-footnote text-label-tertiary text-center">
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
