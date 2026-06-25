"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2 } from "lucide-react";
import { US_STATES } from "@/lib/utils";
import { DashboardNav } from "@/components/ui/dashboard-nav";
import { useLanguage } from "@/components/language-provider";

const STYLE_ITEMS: { value: string; labelKey: string }[] = [
  { value: "Gi", labelKey: "gi" },
  { value: "No-Gi", labelKey: "noGi" },
  { value: "Kids program", labelKey: "kidsProgram" },
  { value: "Competition team", labelKey: "competitionTeam" },
  { value: "Self-defense", labelKey: "selfDefense" },
  { value: "Fundamentals", labelKey: "fundamentals" },
];
const PERK_ITEMS: { value: string; labelKey: string }[] = [
  { value: "Free membership", labelKey: "freeMembership" },
  { value: "Flexible schedule", labelKey: "flexibleSchedule" },
  { value: "Competition support", labelKey: "competitionSupport" },
  { value: "Health benefits", labelKey: "healthBenefits" },
  { value: "Seminar opportunities", labelKey: "seminarOpportunities" },
  { value: "Growth potential", labelKey: "growthPotential" },
];
const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "REVENUE_SHARE"] as const;
const BELT_OPTIONS = ["WHITE", "BLUE", "PURPLE", "BROWN", "BLACK"] as const;
const EXPERIENCE_YEARS = [0, 1, 2, 5] as const;
const PAY_TYPES = ["monthly", "hourly", "revenue_share", "negotiable"] as const;

function PostJobForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const editJobId = searchParams.get("edit");
  const isEditing = !!editJobId;

  const [checkingGym, setCheckingGym] = useState(true);
  const [loadingJob, setLoadingJob] = useState(isEditing);
  const [gymName, setGymName] = useState("");

  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState("FULL_TIME");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [minBelt, setMinBelt] = useState("PURPLE");
  const [minYears, setMinYears] = useState(2);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["Gi", "No-Gi"]);
  const [selectedPerks, setSelectedPerks] = useState<string[]>(["Flexible schedule"]);
  const [payType, setPayType] = useState("hourly");
  const [minPay, setMinPay] = useState("");
  const [maxPay, setMaxPay] = useState("");
  const [description, setDescription] = useState("");
  const [workPermitRequired, setWorkPermitRequired] = useState(false);
  const [sponsorshipAvailable, setSponsorshipAvailable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/gym")
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setGymName(data.name);
          if (!isEditing) {
            setCity(data.city);
            setState(data.state);
          }
        } else {
          router.replace("/register/gym");
        }
      })
      .catch(() => router.replace("/register/gym"))
      .finally(() => setCheckingGym(false));
  }, [router, isEditing]);

  useEffect(() => {
    if (!editJobId) return;
    fetch(`/api/jobs/${editJobId}`)
      .then((r) => r.json())
      .then((job) => {
        if (job.error) {
          setError(t("postJob.loadError"));
          return;
        }
        setTitle(job.title);
        setJobType(job.jobType);
        setCity(job.city);
        setState(job.state);
        setMinBelt(job.minBelt);
        setMinYears(job.minYearsTeaching);
        setSelectedStyles(job.styles ?? []);
        setSelectedPerks(job.perks ?? []);
        setPayType(job.payType ?? "hourly");
        setMinPay(job.minPay != null ? String(job.minPay) : "");
        setMaxPay(job.maxPay != null ? String(job.maxPay) : "");
        setDescription(job.description ?? "");
        setWorkPermitRequired(!!job.workPermitRequired);
        setSponsorshipAvailable(!!job.sponsorshipAvailable);
      })
      .finally(() => setLoadingJob(false));
  }, [editJobId]);

  const toggleStyle = (s: string) =>
    setSelectedStyles((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  const togglePerk = (s: string) =>
    setSelectedPerks((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  async function handlePublish() {
    if (!title || !city || !state || !description) {
      setError(t("postJob.errorRequired"));
      return;
    }
    if (minPay && maxPay && Number(minPay) > Number(maxPay)) {
      setError(t("postJob.errorPayRange"));
      return;
    }

    setSaving(true);
    setError("");
    const payload = {
      title,
      jobType,
      city,
      state,
      minBelt,
      minYearsTeaching: minYears,
      styles: selectedStyles,
      perks: selectedPerks,
      payType,
      minPay: minPay ? Number(minPay) : undefined,
      maxPay: maxPay ? Number(maxPay) : undefined,
      description,
      workPermitRequired,
      sponsorshipAvailable,
    };

    try {
      const res = await fetch(isEditing ? `/api/jobs/${editJobId}` : "/api/jobs", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        if (isEditing) {
          router.push("/dashboard");
        } else {
          router.push(`/dashboard?published=${data.id}`);
        }
      } else {
        setError(typeof data.error === "string" ? data.error : t("postJob.errorGeneric"));
      }
    } catch {
      setError(t("postJob.errorTryAgain"));
    } finally {
      setSaving(false);
    }
  }

  if (checkingGym || loadingJob) {
    return (
      <div className="min-h-screen bg-grouped flex items-center justify-center">
        <div className="text-footnote text-label-tertiary">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grouped">
      <DashboardNav />

      <div className="sticky top-[57px] z-40 px-4 py-3 bg-grouped-secondary/90 backdrop-blur-xl border-b border-separator/30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-caption-1 font-semibold text-label-tertiary uppercase tracking-wide">
              {isEditing ? t("postJob.editBadge") : t("nav.postJob")}
            </div>
            <div className="text-headline font-semibold">
              {isEditing ? title || t("postJob.editJob") : t("postJob.newListing")}
            </div>
          </div>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="btn-primary text-sm !py-2 !px-5 disabled:opacity-60"
          >
            {saving
              ? t("postJob.saving")
              : isEditing
                ? t("postJob.saveChanges")
                : t("postJob.publishListing")}
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <div className="alert-error">{error}</div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <div className="alert-brand flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand shrink-0" />
            <span>
              {t("postJob.postingAs")} <span className="font-semibold">{gymName}</span>
            </span>
          </div>

          <section className="ios-card-lg p-6">
            <h2 className="text-title-2 mb-1">{t("postJob.jobDetailsTitle")}</h2>
            <p className="text-footnote text-label-secondary mb-6">
              {t("postJob.jobDetailsHint")}
            </p>

            <div className="mb-5">
              <label className="field-label">{t("postJob.jobTitle")}</label>
              <input
                className="ios-field"
                placeholder={t("postJob.jobTitlePlaceholder")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="field-label">{t("jobDetail.jobType")}</label>
                <select className="ios-field" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(`postJob.jobTypes.${type}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">{t("dashboard.city")}</label>
                <input
                  className="ios-field"
                  placeholder="Dallas"
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
          </section>

          <section className="ios-card-lg p-6">
            <h2 className="text-title-2 mb-1">{t("postJob.requirementsTitle")}</h2>
            <p className="text-footnote text-label-secondary mb-5">
              {t("postJob.requirementsHint")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="field-label">{t("postJob.minBelt")}</label>
                <select className="ios-field" value={minBelt} onChange={(e) => setMinBelt(e.target.value)}>
                  {BELT_OPTIONS.map((belt) => (
                    <option key={belt} value={belt}>
                      {t(`postJob.belts.${belt}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">{t("postJob.teachingExperience")}</label>
                <select
                  className="ios-field"
                  value={minYears}
                  onChange={(e) => setMinYears(Number(e.target.value))}
                >
                  {EXPERIENCE_YEARS.map((years) => (
                    <option key={years} value={years}>
                      {t(`postJob.experienceYears.${years}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="field-label">{t("postJob.stylePreference")}</label>
              <div className="flex flex-wrap gap-2">
                {STYLE_ITEMS.map(({ value, labelKey }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleStyle(value)}
                    className={`chip-toggle ${selectedStyles.includes(value) ? "chip-toggle-active" : ""}`}
                  >
                    {t(`postJob.styleLabels.${labelKey}`)}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="ios-card-lg p-6">
            <h2 className="text-title-2 mb-1">{t("workAuth.jobSectionTitle")}</h2>
            <p className="text-footnote text-label-secondary mb-5">{t("workAuth.jobSectionHint")}</p>

            <div className="space-y-4">
              <label className="flex items-start gap-3 tap cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={workPermitRequired}
                  onChange={(e) => setWorkPermitRequired(e.target.checked)}
                />
                <span>
                  <span className="text-subheadline font-semibold block">
                    {t("workAuth.jobPermitRequired")}
                  </span>
                  <span className="text-footnote text-label-secondary">
                    {t("workAuth.jobPermitRequiredHint")}
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 tap cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={sponsorshipAvailable}
                  onChange={(e) => setSponsorshipAvailable(e.target.checked)}
                />
                <span>
                  <span className="text-subheadline font-semibold block">
                    {t("workAuth.jobSponsorshipAvailable")}
                  </span>
                  <span className="text-footnote text-label-secondary">
                    {t("workAuth.jobSponsorshipAvailableHint")}
                  </span>
                </span>
              </label>
            </div>
          </section>

          <section className="ios-card-lg p-6">
            <h2 className="text-title-2 mb-1">{t("postJob.compensationTitle")}</h2>
            <p className="text-footnote text-label-secondary mb-5">
              {t("postJob.compensationHint")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div>
                <label className="field-label">{t("postJob.payType")}</label>
                <select className="ios-field" value={payType} onChange={(e) => setPayType(e.target.value)}>
                  {PAY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(`postJob.payTypes.${type}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">{t("postJob.min")}</label>
                <input
                  className="ios-field"
                  placeholder="25"
                  value={minPay}
                  onChange={(e) => setMinPay(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">{t("postJob.max")}</label>
                <input
                  className="ios-field"
                  placeholder="45"
                  value={maxPay}
                  onChange={(e) => setMaxPay(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="field-label">
                {t("postJob.jobDescription")}{" "}
                <span className="font-normal text-label-tertiary">· {t("postJob.jobDescriptionHint")}</span>
              </label>
              <textarea
                className="ios-field"
                rows={4}
                placeholder={t("postJob.jobDescriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label">
                {t("postJob.perksBenefits")}{" "}
                <span className="font-normal text-label-tertiary">· {t("common.optional")}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PERK_ITEMS.map(({ value, labelKey }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => togglePerk(value)}
                    className={`chip-toggle ${selectedPerks.includes(value) ? "chip-toggle-active" : ""}`}
                  >
                    {t(`postJob.perkLabels.${labelKey}`)}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <button
            onClick={handlePublish}
            disabled={saving}
            className="btn-primary w-full disabled:opacity-60"
          >
            {saving
              ? t("postJob.saving")
              : isEditing
                ? t("postJob.saveChanges")
                : t("postJob.publishListing")}
          </button>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-32 lg:self-start">
          <div className="text-caption-1 font-semibold uppercase tracking-wider text-label-tertiary">
            {t("postJob.livePreview")}
          </div>
          <div className="ios-card p-4">
            <div className="text-headline font-semibold mb-1">
              {title || t("postJob.previewJobTitle")}
            </div>
            <div className="flex items-center gap-1 text-footnote text-label-secondary mb-3">
              <Building2 className="w-3.5 h-3.5 text-brand" />
              {gymName} · {city || t("postJob.previewCity")}, {state || t("postJob.previewState")}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="chip chip-active">{t(`postJob.jobTypes.${jobType}`)}</span>
              {selectedStyles.slice(0, 2).map((s) => {
                const item = STYLE_ITEMS.find((i) => i.value === s);
                return (
                  <span key={s} className="chip">
                    {item ? t(`postJob.styleLabels.${item.labelKey}`) : s}
                  </span>
                );
              })}
            </div>
            <div className="text-headline font-semibold">
              {minPay && maxPay
                ? `$${minPay}–$${maxPay}/${payType === "monthly" ? t("postJob.payUnit.mo") : t("postJob.payUnit.hr")}`
                : minPay
                  ? `$${minPay}+`
                  : t("jobDetail.payNegotiable")}
            </div>
          </div>

          <div className="alert-brand">
            <div className="text-footnote font-semibold mb-1">{t("postJob.proTipTitle")}</div>
            <div className="text-caption-1 leading-relaxed">{t("postJob.proTipBody")}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function PostJobPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-grouped flex items-center justify-center">
          <div className="text-footnote text-label-tertiary">{t("common.loading")}</div>
        </div>
      }
    >
      <PostJobForm />
    </Suspense>
  );
}
