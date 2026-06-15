"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Shield, MapPin, Award, Star, ChevronLeft, Briefcase } from "lucide-react";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Coach not found</div>
          <Link href="/jobs" className="text-sm" style={{ color: "#1D9E75" }}>
            ← Browse jobs
          </Link>
        </div>
      </div>
    );
  }

  const beltColor = BELT_COLORS[coach.beltRank] ?? "#9ca3af";
  const beltLabel = BELT_LABELS[coach.beltRank] ?? coach.beltRank;

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
              🥋
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-medium mb-1">
                {coach.firstName} {coach.lastName}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1.5 text-sm text-gray-600">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                    style={{ background: beltColor }}
                  />
                  {beltLabel}
                </span>
                {coach.affiliation && (
                  <span className="text-sm text-gray-500">· {coach.affiliation}</span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                {coach.targetCity && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    Open to: {coach.targetCity}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Award className="w-3.5 h-3.5" />
                  {coach.yearsTeaching} {coach.yearsTeaching === 1 ? "year" : "years"} teaching
                </span>
                {(coach.minPay || coach.maxPay) && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Briefcase className="w-3.5 h-3.5" />
                    {coach.minPay && coach.maxPay
                      ? `$${coach.minPay}–$${coach.maxPay}/hr`
                      : coach.minPay
                      ? `$${coach.minPay}+/hr`
                      : `Up to $${coach.maxPay}/hr`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Specialties */}
          {coach.specialties?.length > 0 && (
            <div className="mt-6">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                Specialties
              </div>
              <div className="flex flex-wrap gap-2">
                {coach.specialties.map((s: string) => (
                  <span
                    key={s}
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: "#E1F5EE", color: "#0F6E56" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bio */}
        {coach.bio && (
          <div className="bg-white border border-gray-100 rounded-2xl p-7 mb-4">
            <h2 className="font-medium mb-3">About</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {coach.bio}
            </p>
          </div>
        )}

        {/* Competition record */}
        {coach.competitionRecord && (
          <div className="bg-white border border-gray-100 rounded-2xl p-7 mb-4">
            <h2 className="font-medium mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" style={{ color: "#1D9E75" }} />
              Competition record
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {coach.competitionRecord}
            </p>
          </div>
        )}

        {/* Stats footer */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
          <div className="text-xs text-gray-400">
            Member since{" "}
            {new Date(coach.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <Link
            href="/jobs"
            className="text-sm font-medium px-4 py-2 rounded-lg"
            style={{ background: "#E1F5EE", color: "#0F6E56" }}
          >
            Browse open positions →
          </Link>
        </div>
      </div>
    </div>
  );
}
