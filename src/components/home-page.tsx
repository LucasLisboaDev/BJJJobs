"use client";
import Link from "next/link";
import { Search, Users, Building2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { AppNav } from "@/components/ui/app-nav";
import { PageShell, PageCol, SectionLabel } from "@/components/ui/page-shell";

const FEATURED_JOBS = [
  {
    id: "1",
    title: "Head BJJ Coach",
    gym: "Alliance Jiu-Jitsu",
    city: "Miami, FL",
    type: "Full-time",
    belt: "Black belt",
    pay: "$4,500/mo",
    postedAt: "2 days ago",
    isNew: true,
    beltColor: "#1a1a1a",
  },
  {
    id: "2",
    title: "Kids Program Instructor",
    gym: "Gracie Barra",
    city: "Austin, TX",
    type: "Part-time",
    belt: "Purple belt+",
    pay: "$28/hr",
    postedAt: "4 days ago",
    isNew: false,
    beltColor: "#8b5cf6",
  },
  {
    id: "3",
    title: "Competition Team Coach",
    gym: "10th Planet",
    city: "Los Angeles, CA",
    type: "Full-time",
    belt: "No-Gi specialist",
    pay: "$5,200/mo",
    postedAt: "1 day ago",
    isNew: true,
    beltColor: "#92400e",
  },
  {
    id: "4",
    title: "No-Gi Fundamentals Coach",
    gym: "Atos Jiu-Jitsu",
    city: "San Diego, CA",
    type: "Part-time",
    belt: "Brown belt+",
    pay: "$32/hr",
    postedAt: "5 days ago",
    isNew: false,
    beltColor: "#92400e",
  },
];

export default function HomePage() {
  const { t } = useLanguage();

  const stats = [
    { num: "340+", label: t("home.stats.openPositions") },
    { num: "180+", label: t("home.stats.gymsHiring") },
    { num: "1,200+", label: t("home.stats.coachesRegistered") },
    { num: "42", label: t("home.stats.statesCovered") },
  ];

  const steps = [
    { n: "01", title: t("home.steps.s1Title"), desc: t("home.steps.s1Desc") },
    { n: "02", title: t("home.steps.s2Title"), desc: t("home.steps.s2Desc") },
    { n: "03", title: t("home.steps.s3Title"), desc: t("home.steps.s3Desc") },
  ];

  return (
    <PageShell>
      <AppNav variant="floating" showBeta />

      <div className="pt-[74px]">
        <PageCol>
          {/* Hero — Liquid Glass style */}
          <div className="relative overflow-hidden rounded-[28px] p-10 md:p-11 mb-5 shadow-ios-lg hero-gradient">
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage: "url(/images/covers/cover1.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center 28%",
              }}
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-capsule bg-white/20 backdrop-blur-sm border border-white/40 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_9px_rgba(255,255,255,0.95)]" />
                <span className="text-caption-1 font-semibold text-white">
                  {t("home.badge")}
                </span>
              </div>
              <h1 className="text-large-title text-white mb-3 max-w-md">
                {t("home.heroTitle")}{" "}
                <span className="text-white">{t("home.heroHighlight")}</span>{" "}
                {t("home.heroTitleEnd")}
              </h1>
              <p className="text-body text-white/90 max-w-sm mb-0">{t("home.heroSubtitle")}</p>
            </div>
          </div>

          {/* Search */}
          <Link
            href="/jobs"
            className="tap lift flex items-center gap-3 ios-card-lg px-4 py-3.5 mb-7"
          >
            <Search className="w-5 h-5 text-label-secondary flex-shrink-0" />
            <span className="text-body text-label-secondary flex-1">
              {t("home.searchPlaceholder")}
            </span>
            <span className="btn-primary !py-2 !px-4 text-sm">{t("common.search")}</span>
          </Link>

          {/* Stats */}
          <div className="stat-grid mb-8">
            {stats.map((s) => (
              <div key={s.label} className="stat-cell">
                <div className="font-display font-bold text-xl">{s.num}</div>
                <div className="text-caption-1 text-label-secondary mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Featured jobs grid */}
          <SectionLabel>{t("home.latestOpenings")}</SectionLabel>
          <h2 className="text-title-2 text-label mb-1">{t("home.featuredJobs")}</h2>
          <p className="text-subheadline text-label-secondary mb-5">{t("home.featuredSub")}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {FEATURED_JOBS.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="tap lift ios-card-lg p-4 block"
              >
                <div className="font-semibold text-[15px] leading-snug mb-0.5">{job.title}</div>
                <div className="text-footnote text-label-secondary mb-3">
                  {job.gym} · {job.city}
                </div>
                <div className="flex items-center gap-1.5 mb-3">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: job.beltColor }}
                  />
                  <span className="text-footnote text-label">{job.belt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-base">{job.pay}</span>
                  <span className="chip text-brand bg-brand-light/60">{job.type}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mb-10">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-subheadline font-semibold text-brand tap"
            >
              {t("home.viewAllJobs")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* How it works */}
          <SectionLabel>{t("home.howItWorks")}</SectionLabel>
          <h2 className="text-title-2 text-label mb-5">{t("home.howTitle")}</h2>
          <div className="flex flex-col gap-2.5 mb-10">
            {steps.map((item) => (
              <div key={item.n} className="ios-card flex gap-3.5 p-4">
                <div className="font-display font-bold text-[15px] text-brand w-6 flex-shrink-0">
                  {item.n}
                </div>
                <div>
                  <div className="text-headline mb-0.5">{item.title}</div>
                  <div className="text-footnote text-label-secondary leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Role CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            <Link
              href="/register/coach/account"
              className="tap lift ios-card-lg p-5 flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-brand" />
              </div>
              <div>
                <div className="text-headline">{t("home.imCoach")}</div>
                <div className="text-footnote text-label-secondary">{t("home.coachSub")}</div>
              </div>
            </Link>
            <Link
              href="/register/gym/account"
              className="tap lift ios-card-lg p-5 flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-brand" />
              </div>
              <div>
                <div className="text-headline">{t("home.imGym")}</div>
                <div className="text-footnote text-label-secondary">{t("home.gymSub")}</div>
              </div>
            </Link>
          </div>

          {/* Footer CTA */}
          <div className="rounded-[22px] p-8 text-center bg-brand">
            <h2 className="text-title-2 text-white mb-2">{t("home.footerCtaTitle")}</h2>
            <p className="text-subheadline text-white/80 mb-5">{t("home.footerCtaSub")}</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/post-job"
                className="tap bg-white text-brand-dark rounded-capsule px-6 py-2.5 text-subheadline font-semibold"
              >
                {t("home.postJobFree")}
              </Link>
              <Link
                href="/register/coach/account"
                className="tap border border-white/30 text-white rounded-capsule px-6 py-2.5 text-subheadline font-semibold"
              >
                {t("home.footerCoach")}
              </Link>
            </div>
          </div>
        </PageCol>

        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-t border-separator/30 max-w-3xl mx-auto">
          <div className="text-footnote text-label-tertiary">BJJJobs.com · 2025</div>
          <div className="flex gap-5 text-caption-1 text-label-tertiary">
            <Link href="/about" className="hover:text-label-secondary">
              {t("nav.aboutUs")}
            </Link>
            <Link href="/privacy">{t("footer.privacy")}</Link>
            <Link href="/terms">{t("footer.terms")}</Link>
            <Link href="/contact">{t("footer.contact")}</Link>
          </div>
        </footer>
      </div>
    </PageShell>
  );
}
