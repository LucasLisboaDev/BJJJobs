"use client";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useLanguage } from "@/components/language-provider";
import LanguageSwitcher from "@/components/language-switcher";
import { Logo } from "@/components/ui/logo";

type DashboardNavProps = {
  showPostJob?: boolean;
};

export function DashboardNav({ showPostJob }: DashboardNavProps) {
  const { t } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 px-4 py-3 bg-grouped-secondary/90 backdrop-blur-xl border-b border-separator/30">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <Logo />
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Link
            href="/jobs"
            className="text-subheadline font-semibold text-label-secondary hover:text-label px-3 py-1.5"
          >
            {t("nav.browseJobs")}
          </Link>
          {showPostJob && (
            <Link href="/post-job" className="btn-primary text-sm !py-2 !px-4">
              {t("nav.postJob")}
            </Link>
          )}
          <LanguageSwitcher />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
