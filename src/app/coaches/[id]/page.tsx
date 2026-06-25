"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Award, Star, ChevronLeft, Briefcase } from "lucide-react";
import PublicNav from "@/components/public-nav";
import { CoachExperienceSection } from "@/components/coach-experience-section";
import { InstagramLink } from "@/components/instagram-link";
import { ProfileAvatar } from "@/components/profile-avatar";
import { WorkAuthorizationBadge } from "@/components/work-authorization-badges";
import { formatCoachLocation } from "@/lib/coach-location";

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

export default function CoachProfilePage() {
  const { id } = useParams();
  const [coach, setCoach] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/coaches/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setCoach(data.error ? null : data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-grouped flex items-center justify-center">
        <div className="text-footnote text-label-tertiary">Loading profile...</div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-grouped flex items-center justify-center">
        <div className="text-center">
          <div className="text-title-2 mb-2">Coach not found</div>
          <Link href="/jobs" className="text-subheadline font-semibold text-brand">
            ← Browse jobs
          </Link>
        </div>
      </div>
    );
  }

  const beltColor = BELT_COLORS[coach.beltRank] ?? "#9ca3af";
  const beltLabel = BELT_LABELS[coach.beltRank] ?? coach.beltRank;
  const coachLocation = formatCoachLocation(coach);

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
            <ProfileAvatar
              src={coach.photoUrl}
              alt={`${coach.firstName} ${coach.lastName}`}
              fallback="🥋"
              size="lg"
              rounded="full"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-title-2 mb-1">
                {coach.firstName} {coach.lastName}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1.5 text-subheadline text-label-secondary">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                    style={{ background: beltColor }}
                  />
                  {beltLabel}
                </span>
                {coach.affiliation && (
                  <span className="text-subheadline text-label-tertiary">· {coach.affiliation}</span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                {coachLocation && (
                  <span className="flex items-center gap-1 text-footnote text-label-secondary">
                    <MapPin className="w-3.5 h-3.5" />
                    Located in: {coachLocation}
                  </span>
                )}
                {coach.targetCity && (
                  <span className="flex items-center gap-1 text-footnote text-label-secondary">
                    <MapPin className="w-3.5 h-3.5" />
                    Open to: {coach.targetCity}
                  </span>
                )}
                <span className="flex items-center gap-1 text-footnote text-label-secondary">
                  <Award className="w-3.5 h-3.5" />
                  {coach.yearsTeaching} {coach.yearsTeaching === 1 ? "year" : "years"} teaching
                </span>
                {(coach.minPay || coach.maxPay) && (
                  <span className="flex items-center gap-1 text-footnote text-label-secondary">
                    <Briefcase className="w-3.5 h-3.5" />
                    {coach.minPay && coach.maxPay
                      ? `$${coach.minPay}–$${coach.maxPay}/hr`
                      : coach.minPay
                      ? `$${coach.minPay}+/hr`
                      : `Up to $${coach.maxPay}/hr`}
                  </span>
                )}
                {coach.instagram && (
                  <InstagramLink handle={coach.instagram} className="text-footnote text-brand" />
                )}
                {coach.workAuthorizationStatus && (
                  <WorkAuthorizationBadge status={coach.workAuthorizationStatus} />
                )}
              </div>
            </div>
          </div>

          {coach.specialties?.length > 0 && (
            <div className="mt-6">
              <div className="text-caption-1 font-semibold text-label-tertiary uppercase tracking-wide mb-2">
                Specialties
              </div>
              <div className="flex flex-wrap gap-2">
                {coach.specialties.map((s: string) => (
                  <span key={s} className="chip chip-active !bg-brand-light !text-brand-dark">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <CoachExperienceSection coach={coach} />

        {coach.bio && (
          <div className="ios-card-lg p-7 mb-4">
            <h2 className="text-headline font-semibold mb-3">About</h2>
            <p className="text-subheadline text-label-secondary leading-relaxed whitespace-pre-line">
              {coach.bio}
            </p>
          </div>
        )}

        {coach.competitionRecord && (
          <div className="ios-card-lg p-7 mb-4">
            <h2 className="text-headline font-semibold mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-brand" />
              Competition record
            </h2>
            <p className="text-subheadline text-label-secondary leading-relaxed whitespace-pre-line">
              {coach.competitionRecord}
            </p>
          </div>
        )}

        <div className="ios-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-footnote text-label-tertiary">
            Member since{" "}
            {new Date(coach.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <Link href="/jobs" className="btn-secondary text-sm !py-2 !px-4">
            Browse open positions →
          </Link>
        </div>
      </div>
    </div>
  );
}
