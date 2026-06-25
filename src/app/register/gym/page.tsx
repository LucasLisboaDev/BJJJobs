"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { US_STATES } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { STORAGE_KEYS, readStored } from "@/lib/brand";
import { ProfilePhotoUpload } from "@/components/profile-photo-upload";
import { useLanguage } from "@/components/language-provider";
import LanguageSwitcher from "@/components/language-switcher";

export default function GymRegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [checkingAccount, setCheckingAccount] = useState(true);
  const [wrongAccount, setWrongAccount] = useState(false);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      router.replace("/register/gym/account");
      return;
    }

    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.role === "COACH" && data.coach) {
          setWrongAccount(true);
        } else if (data.role === "GYM" && data.gym) {
          router.replace("/dashboard");
        }
      })
      .finally(() => setCheckingAccount(false));
  }, [isLoaded, userId, router]);

  useEffect(() => {
    if (name) return;
    const fromMeta = user?.unsafeMetadata?.gymName;
    if (typeof fromMeta === "string" && fromMeta.trim()) {
      setName(fromMeta.trim());
      return;
    }
    const stored = readStored("gymName");
    if (stored?.trim()) setName(stored.trim());
  }, [user, name]);

  async function handleSubmit() {
    if (!name || !city || !state) {
      setError(t("register.gymProfile.errorRequired"));
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/gym", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          logoUrl: logoUrl || undefined,
          city,
          state,
          affiliation: affiliation || undefined,
          website: website || undefined,
          instagram: instagram || undefined,
          description: description || undefined,
        }),
      });
      if (res.ok) {
        sessionStorage.removeItem(STORAGE_KEYS.gymName);
        sessionStorage.removeItem(STORAGE_KEYS.signupRole);
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || t("register.gymProfile.errorGeneric"));
      }
    } catch {
      setError(t("register.gymProfile.errorTryAgain"));
    } finally {
      setSaving(false);
    }
  }

  if (!isLoaded || checkingAccount) {
    return (
      <div className="min-h-screen bg-grouped flex items-center justify-center">
        <div className="text-footnote text-label-tertiary">{t("common.loading")}</div>
      </div>
    );
  }

  if (wrongAccount) {
    return (
      <div className="min-h-screen bg-grouped flex items-center justify-center px-6">
        <div className="max-w-md text-center ios-card-lg p-8">
          <div className="text-3xl mb-4">🏋️</div>
          <h1 className="text-title-2 mb-2">{t("register.gymProfile.wrongAccountTitle")}</h1>
          <p className="text-subheadline text-label-secondary mb-8 leading-relaxed">
            {t("register.gymProfile.wrongAccountSub")}
          </p>
          <div className="flex flex-col gap-3">
            <SignOutButton redirectUrl="/register/gym/account">
              <button className="btn-primary w-full">{t("register.gymProfile.signOutCreateGym")}</button>
            </SignOutButton>
            <Link href="/dashboard" className="btn-secondary w-full text-center">
              {t("register.gymProfile.goToCoachDashboard")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grouped">
      <div className="sticky top-0 z-50 px-4 py-3 bg-grouped-secondary/90 backdrop-blur-xl border-b border-separator/30">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <div className="text-caption-1 text-label-tertiary">{t("register.gymProfile.badge")}</div>
          </div>
        </div>
      </div>

      <div className="page-col max-w-lg">
        <h1 className="text-title-1 mb-2">{t("register.gymProfile.title")}</h1>
        <p className="text-subheadline text-label-secondary mb-8">{t("register.gymProfile.sub")}</p>

        {error && <div className="alert-error mb-5">{error}</div>}

        <div className="ios-card-lg p-6 space-y-5">
          <ProfilePhotoUpload
            kind="logo"
            value={logoUrl}
            onChange={setLogoUrl}
            alt={name || "Gym logo"}
            fallback="🏛️"
            label={t("register.gymProfile.gymLogo")}
            hint={t("register.gymProfile.gymLogoHint")}
          />

          <div>
            <label className="field-label">{t("register.gymProfile.gymName")}</label>
            <input
              className="ios-field"
              placeholder={t("register.gymProfile.gymNamePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">{t("dashboard.city")}</label>
              <input
                className="ios-field"
                placeholder="Miami"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">{t("dashboard.state")}</label>
              <select className="ios-field" value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">{t("dashboard.selectState")}</option>
                {US_STATES.map((s) => (
                  <option key={s.abbr} value={s.abbr}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="field-label">
              {t("register.gymProfile.affiliation")}{" "}
              <span className="font-normal text-label-tertiary">· {t("common.optional")}</span>
            </label>
            <input
              className="ios-field"
              placeholder={t("register.gymProfile.affiliationPlaceholder")}
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">
              {t("register.gymProfile.website")}{" "}
              <span className="font-normal text-label-tertiary">· {t("common.optional")}</span>
            </label>
            <input
              className="ios-field"
              placeholder={t("register.gymProfile.websitePlaceholder")}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">
              {t("register.gymProfile.instagram")}{" "}
              <span className="font-normal text-label-tertiary">· {t("common.optional")}</span>
            </label>
            <input
              className="ios-field"
              placeholder={t("register.gymProfile.instagramPlaceholder")}
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">
              {t("register.gymProfile.aboutGym")}{" "}
              <span className="font-normal text-label-tertiary">· {t("common.optional")}</span>
            </label>
            <textarea
              className="ios-field"
              rows={3}
              placeholder={t("register.gymProfile.aboutGymPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button onClick={handleSubmit} disabled={saving} className="btn-primary w-full disabled:opacity-60">
            {saving ? t("register.gymProfile.saving") : t("register.gymProfile.createProfile")}
          </button>
        </div>
      </div>
    </div>
  );
}
