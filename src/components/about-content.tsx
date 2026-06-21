"use client";
import Link from "next/link";
import {
  Shield,
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
    <div className="min-h-screen bg-white">
      <PublicNav />

      <section className="px-8 py-20 text-center border-b border-gray-100 bg-gray-50">
        <div
          className="inline-block text-xs font-medium px-4 py-1.5 rounded-full mb-5"
          style={{ background: "#E1F5EE", color: "#0F6E56" }}
        >
          {t("about.badge")}
        </div>
        <h1 className="text-4xl font-medium text-gray-900 leading-tight mb-4 max-w-2xl mx-auto">
          {t("about.heroTitle")}
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">{t("about.heroSub")}</p>
      </section>

      <section className="px-8 py-16 max-w-3xl mx-auto">
        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#E1F5EE" }}
          >
            <Target className="w-5 h-5" style={{ color: "#1D9E75" }} />
          </div>
          <div>
            <h2 className="text-xl font-medium mb-3">{t("about.missionTitle")}</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{t("about.missionP1")}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{t("about.missionP2")}</p>
          </div>
        </div>
      </section>

      <section className="px-8 py-14 bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-medium text-center mb-10">{t("about.whyTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="text-xs font-medium uppercase tracking-wider mb-3 text-gray-400">
                {t("about.oldWay")}
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                {oldWayItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-gray-300 mt-0.5">×</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div
                className="text-xs font-medium uppercase tracking-wider mb-3"
                style={{ color: "#1D9E75" }}
              >
                {t("about.newWay")}
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                {newWayItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "#1D9E75" }} className="mt-0.5">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 py-16 max-w-3xl mx-auto">
        <h2 className="text-xl font-medium text-center mb-10">{t("about.whoTitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="border border-gray-100 rounded-2xl p-7">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "#E1F5EE" }}
            >
              <Users className="w-5 h-5" style={{ color: "#1D9E75" }} />
            </div>
            <h3 className="font-medium mb-2">{t("about.forCoaches")}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{t("about.coachesDesc")}</p>
            <Link
              href="/register/coach/account"
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "#1D9E75" }}
            >
              {t("about.createCoachProfile")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="border border-gray-100 rounded-2xl p-7">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "#E1F5EE" }}
            >
              <Building2 className="w-5 h-5" style={{ color: "#1D9E75" }} />
            </div>
            <h3 className="font-medium mb-2">{t("about.forGyms")}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{t("about.gymsDesc")}</p>
            <Link
              href="/register/gym/account"
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "#1D9E75" }}
            >
              {t("about.createGymProfile")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-8 py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-medium text-center mb-10">{t("about.beliefsTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {beliefs.map((item) => (
              <div key={item.title} className="bg-white border border-gray-100 rounded-xl p-5">
                <item.icon className="w-5 h-5 mb-3" style={{ color: "#1D9E75" }} />
                <div className="font-medium text-sm mb-2">{item.title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 py-16 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-6 h-6" style={{ color: "#1D9E75" }} />
          <span className="text-lg font-medium">BJJJobs</span>
        </div>
        <h2 className="text-2xl font-medium mb-3">{t("about.ctaTitle")}</h2>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">{t("about.ctaSub")}</p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/jobs"
            className="text-sm font-medium px-6 py-2.5 rounded-lg border border-gray-200 hover:border-green-400 transition-colors"
          >
            {t("about.browseOpen")}
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-white px-6 py-2.5 rounded-lg"
            style={{ background: "#1D9E75" }}
          >
            {t("nav.createAccount")}
          </Link>
        </div>
      </section>

      <footer className="flex items-center justify-between px-8 py-5 border-t border-gray-100">
        <div className="text-sm text-gray-400">BJJJobs.com · 2025</div>
        <div className="flex gap-5 text-xs text-gray-400">
          <Link href="/about" className="hover:text-gray-600">
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
