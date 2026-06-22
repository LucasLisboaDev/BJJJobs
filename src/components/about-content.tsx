"use client";
import Link from "next/link";
import {
  Users,
  Building2,
  Target,
  Heart,
  ArrowRight,
  Search,
  MessageCircle,
} from "lucide-react";
import PublicNav from "@/components/public-nav";
import { useLanguage } from "@/components/language-provider";
import { Logo } from "@/components/ui/logo";

export default function AboutContent() {
  const { t } = useLanguage();

  const oldWayItems = [
    t("about.oldWay1"),
    t("about.oldWay2"),
    t("about.oldWay3"),
    t("about.oldWay4"),
  ];

  const newWayItems = [
    t("about.newWay1"),
    t("about.newWay2"),
    t("about.newWay3"),
    t("about.newWay4"),
  ];

  const beliefs = [
    { icon: Search, title: t("about.belief1Title"), desc: t("about.belief1Desc") },
    { icon: Heart, title: t("about.belief2Title"), desc: t("about.belief2Desc") },
    { icon: MessageCircle, title: t("about.belief3Title"), desc: t("about.belief3Desc") },
  ];

  return (
    <div className="min-h-screen bg-grouped">
      <PublicNav />

      <section className="page-col text-center border-b border-separator/30">
        <div className="inline-block text-caption-1 font-semibold px-4 py-1.5 rounded-capsule mb-5 bg-brand-light text-brand-dark">
          {t("about.badge")}
        </div>
        <h1 className="text-large-title mb-4 max-w-2xl mx-auto">{t("about.heroTitle")}</h1>
        <p className="text-body text-label-secondary max-w-xl mx-auto leading-relaxed">
          {t("about.heroSub")}
        </p>
      </section>

      <section className="page-col max-w-3xl">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-ios flex items-center justify-center shrink-0 bg-brand-light">
            <Target className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h2 className="text-title-2 mb-3">{t("about.missionTitle")}</h2>
            <p className="text-subheadline text-label-secondary leading-relaxed mb-4">
              {t("about.missionP1")}
            </p>
            <p className="text-subheadline text-label-secondary leading-relaxed">
              {t("about.missionP2")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-fill-quaternary border-y border-separator/20">
        <div className="page-col max-w-3xl !py-0">
          <h2 className="text-title-2 text-center mb-10">{t("about.whyTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="ios-card-lg p-6">
              <div className="text-caption-1 font-semibold uppercase tracking-wider mb-3 text-label-tertiary">
                {t("about.oldWay")}
              </div>
              <ul className="space-y-3 text-subheadline text-label-secondary">
                {oldWayItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-label-tertiary mt-0.5">×</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="ios-card-lg p-6 ring-1 ring-brand/20">
              <div className="text-caption-1 font-semibold uppercase tracking-wider mb-3 text-brand">
                {t("about.newWay")}
              </div>
              <ul className="space-y-3 text-subheadline text-label-secondary">
                {newWayItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-brand mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="page-col max-w-3xl">
        <h2 className="text-title-2 text-center mb-10">{t("about.whoTitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="ios-card-lg p-7">
            <div className="w-11 h-11 rounded-ios flex items-center justify-center mb-4 bg-brand-light">
              <Users className="w-5 h-5 text-brand" />
            </div>
            <h3 className="text-headline font-semibold mb-2">{t("about.forCoaches")}</h3>
            <p className="text-subheadline text-label-secondary leading-relaxed mb-4">
              {t("about.coachesDesc")}
            </p>
            <Link
              href="/register/coach/account"
              className="inline-flex items-center gap-1.5 text-subheadline font-semibold text-brand tap"
            >
              {t("about.createCoachProfile")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="ios-card-lg p-7">
            <div className="w-11 h-11 rounded-ios flex items-center justify-center mb-4 bg-brand-light">
              <Building2 className="w-5 h-5 text-brand" />
            </div>
            <h3 className="text-headline font-semibold mb-2">{t("about.forGyms")}</h3>
            <p className="text-subheadline text-label-secondary leading-relaxed mb-4">
              {t("about.gymsDesc")}
            </p>
            <Link
              href="/register/gym/account"
              className="inline-flex items-center gap-1.5 text-subheadline font-semibold text-brand tap"
            >
              {t("about.createGymProfile")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 bg-fill-quaternary border-t border-separator/20">
        <div className="page-col max-w-3xl !py-0">
          <h2 className="text-title-2 text-center mb-10">{t("about.beliefsTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {beliefs.map((item) => (
              <div key={item.title} className="ios-card p-5">
                <item.icon className="w-5 h-5 mb-3 text-brand" />
                <div className="text-headline font-semibold mb-2">{item.title}</div>
                <p className="text-footnote text-label-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-col max-w-2xl text-center">
        <div className="flex items-center justify-center mb-4">
          <Logo />
        </div>
        <h2 className="text-title-1 mb-3">{t("about.ctaTitle")}</h2>
        <p className="text-subheadline text-label-secondary mb-8 leading-relaxed">{t("about.ctaSub")}</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/jobs" className="btn-secondary text-sm">
            {t("about.browseOpen")}
          </Link>
          <Link href="/register" className="btn-primary text-sm">
            {t("nav.createAccount")}
          </Link>
        </div>
      </section>

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
  );
}
