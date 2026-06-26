"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import LanguageSwitcher from "@/components/language-switcher";
import { Logo } from "@/components/ui/logo";

type AppNavProps = {
  variant?: "floating" | "sticky";
  showBeta?: boolean;
};

const linkClass =
  "text-subheadline font-semibold text-label-secondary hover:text-label transition-colors px-3.5 py-1.5 rounded-capsule";
const mobileMenuLinkClass =
  "block w-full text-left text-body font-semibold text-label px-4 py-3 rounded-ios hover:bg-fill-tertiary transition-colors";

export function AppNav({ variant = "floating", showBeta = false }: AppNavProps) {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const menuLinks = (
    <>
      <Link href="/about" className={mobileMenuLinkClass} onClick={closeMenu}>
        {t("nav.aboutUs")}
      </Link>
      <Link href="/contact" className={mobileMenuLinkClass} onClick={closeMenu}>
        {t("footer.contact")}
      </Link>
      <SignedOut>
        <Link href="/register" className={mobileMenuLinkClass} onClick={closeMenu}>
          {t("nav.createAccount")}
        </Link>
      </SignedOut>
      <SignedIn>
        <Link href="/dashboard" className={mobileMenuLinkClass} onClick={closeMenu}>
          {t("nav.dashboard")}
        </Link>
      </SignedIn>
      <div className="px-4 py-3">
        <LanguageSwitcher />
      </div>
    </>
  );

  const desktopLinks = (
    <>
      <Link href="/jobs" className={linkClass}>
        {t("nav.browseJobs")}
      </Link>
      <Link href="/about" className={linkClass}>
        {t("nav.aboutUs")}
      </Link>
      <Link href="/contact" className={linkClass}>
        {t("footer.contact")}
      </Link>
      <LanguageSwitcher />
      <SignedOut>
        <Link href="/login" className={linkClass}>
          {t("nav.signIn")}
        </Link>
        <Link href="/register" className="btn-primary text-sm !py-2 !px-4">
          {t("nav.createAccount")}
        </Link>
      </SignedOut>
      <SignedIn>
        <Link href="/dashboard" className={linkClass}>
          {t("nav.dashboard")}
        </Link>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </>
  );

  const mobilePrimaryLinks = (
    <>
      <Link
        href="/jobs"
        className="text-caption-1 font-semibold text-label-secondary hover:text-label whitespace-nowrap px-2 py-1.5"
      >
        {t("nav.browseJobs")}
      </Link>
      <SignedOut>
        <Link
          href="/login"
          className="text-caption-1 font-semibold text-label-secondary hover:text-label whitespace-nowrap px-2 py-1.5"
        >
          {t("nav.signIn")}
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="p-2 -mr-1 rounded-ios hover:bg-fill-tertiary tap"
        aria-label={t("nav.menu")}
        aria-expanded={menuOpen}
      >
        <Menu className="w-5 h-5 text-label" />
      </button>
    </>
  );

  const mobileMenu = menuOpen ? (
    <div className="fixed inset-0 z-[100] md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        aria-label={t("nav.closeMenu")}
        onClick={closeMenu}
      />
      <div className="absolute top-0 right-0 h-full w-[min(100%,280px)] bg-grouped-secondary shadow-ios-lg flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-separator/30">
          <span className="text-headline font-semibold">{t("nav.menu")}</span>
          <button
            type="button"
            onClick={closeMenu}
            className="p-2 rounded-ios hover:bg-fill-tertiary tap"
            aria-label={t("nav.closeMenu")}
          >
            <X className="w-5 h-5 text-label" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">{menuLinks}</nav>
      </div>
    </div>
  ) : null;

  const logoBlock = (
    <div className="flex items-center gap-2 min-w-0">
      <Logo />
      {showBeta && (
        <span className="text-caption-2 font-semibold text-white bg-brand px-2 py-0.5 rounded-capsule shrink-0">
          BETA
        </span>
      )}
    </div>
  );

  if (variant === "sticky") {
    return (
      <>
        <nav className="sticky top-0 z-50 px-4 py-2.5 bg-grouped-secondary/90 backdrop-blur-xl border-b border-separator/30">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
            {logoBlock}
            <div className="hidden md:flex items-center gap-2 flex-wrap justify-end">{desktopLinks}</div>
            <div className="flex md:hidden items-center gap-0.5 shrink-0">{mobilePrimaryLinks}</div>
          </div>
        </nav>
        {mobileMenu}
      </>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-2 pb-1.5 pointer-events-none">
        <nav className="lg-bar max-w-4xl mx-auto flex items-center justify-between gap-2 px-3 sm:px-4 py-1.5 pointer-events-auto">
          {logoBlock}
          <div className="hidden md:flex items-center gap-1.5 flex-wrap justify-end">{desktopLinks}</div>
          <div className="flex md:hidden items-center gap-0.5 shrink-0">{mobilePrimaryLinks}</div>
        </nav>
      </header>
      {mobileMenu}
    </>
  );
}
