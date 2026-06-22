"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";
import PublicNav from "@/components/public-nav";
import { useLanguage } from "@/components/language-provider";
import { PageShell, PageCol, PageTitle } from "@/components/ui/page-shell";

const BELT_LABELS: Record<string, string> = {
  WHITE: "White belt+",
  BLUE: "Blue belt+",
  PURPLE: "Purple belt+",
  BROWN: "Brown belt+",
  BLACK: "Black belt",
};
const BELT_COLORS: Record<string, string> = {
  WHITE: "#9ca3af",
  BLUE: "#3b82f6",
  PURPLE: "#8b5cf6",
  BROWN: "#92400e",
  BLACK: "#1a1a1a",
};
const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  REVENUE_SHARE: "Revenue share",
};

export default function JobsPage() {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [belt, setBelt] = useState("");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city) params.set("city", city);
    if (belt) params.set("belt", belt);
    const res = await fetch(`/api/jobs?${params}`);
    const data = await res.json();
    setJobs(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [query, city, belt]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const beltOptions = [
    { value: "", label: t("jobs.allBelts") },
    { value: "WHITE", label: "White belt+" },
    { value: "BLUE", label: "Blue belt+" },
    { value: "PURPLE", label: "Purple belt+" },
    { value: "BROWN", label: "Brown belt+" },
    { value: "BLACK", label: "Black belt" },
  ];

  return (
    <PageShell>
      <PublicNav />
      <PageCol>
        <PageTitle>{t("jobs.title")}</PageTitle>

        <div className="search-field mb-2.5">
          <Search className="w-[18px] h-[18px] text-label-tertiary flex-shrink-0" />
          <input
            placeholder={t("jobs.searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="search-field mb-3.5">
          <MapPin className="w-[18px] h-[18px] text-label-tertiary flex-shrink-0" />
          <input
            placeholder={t("jobs.cityPlaceholder")}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3.5 mb-1.5 scrollbar-none">
          {beltOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setBelt(opt.value)}
              className={`chip tap ${belt === opt.value ? "chip-active" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button type="button" onClick={fetchJobs} className="btn-primary w-full mb-4">
          {t("common.search")}
        </button>

        <div className="text-footnote text-label-secondary mb-3 px-0.5">
          {loading ? t("jobs.loading") : `${jobs.length} open positions`}
        </div>

        {loading ? (
          <div className="text-center py-16 text-footnote text-label-tertiary">
            {t("jobs.loading")}
          </div>
        ) : jobs.length === 0 ? (
          <div className="ios-card-lg p-10 text-center">
            <div className="text-headline mb-2">{t("jobs.noneTitle")}</div>
            <p className="text-footnote text-label-secondary mb-6">{t("jobs.noneSub")}</p>
            <Link href="/register" className="btn-primary">
              {t("nav.createAccount")}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="tap lift ios-card-lg p-4 flex items-center gap-3.5"
              >
                <div className="w-12 h-12 rounded-[13px] bg-brand-light text-brand flex items-center justify-center text-xl flex-shrink-0">
                  🥋
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-headline truncate">{job.title}</div>
                  <div className="text-footnote text-label-secondary mt-0.5">
                    {job.gym?.name} · {job.city}, {job.state}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="chip text-brand">{JOB_TYPE_LABELS[job.jobType]}</span>
                    <span className="chip">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: BELT_COLORS[job.minBelt] }}
                      />
                      {BELT_LABELS[job.minBelt]}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {job.featured && (
                    <span className="chip chip-active text-[10px] mb-1">{t("jobs.featured")}</span>
                  )}
                  <div className="text-headline">
                    {job.minPay
                      ? `$${job.minPay}${job.payType === "monthly" ? "/mo" : "/hr"}`
                      : t("jobs.negotiable")}
                  </div>
                  <div className="text-caption-1 text-label-tertiary mt-1">
                    {new Date(job.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageCol>
    </PageShell>
  );
}
