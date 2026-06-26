"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth, SignOutButton } from "@clerk/nextjs";
import {
  ShieldCheck,
  MapPin,
  Eye,
  Briefcase,
  FileText,
  Upload,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import type { WorkExperienceInput } from "@/lib/coach-experience";
import { Logo } from "@/components/ui/logo";
import { STORAGE_KEYS, readStored } from "@/lib/brand";
import { ProfilePhotoUpload } from "@/components/profile-photo-upload";
import { CoachLocationFields } from "@/components/coach-location-fields";
import {
  coachLocationToPayload,
  emptyCoachLocation,
  validateCoachLocation,
  type CoachLocationInput,
} from "@/lib/coach-location";

const BELTS = ["WHITE", "BLUE", "PURPLE", "BROWN", "BLACK"];
const BELT_LABELS: Record<string, string> = {
  WHITE: "White", BLUE: "Blue", PURPLE: "Purple", BROWN: "Brown", BLACK: "Black",
};
const BELT_COLORS: Record<string, string> = {
  WHITE: "#ccc", BLUE: "#3478c8", PURPLE: "#8b5cf6", BROWN: "#92400e", BLACK: "#1a1a1a",
};
const SPECIALTIES = ["Gi", "No-Gi", "Kids classes", "Competition prep", "Self-defense", "Fundamentals", "Women's only"];
const YEARS_OPTIONS = [
  { label: "Less than 1 year", value: 0 },
  { label: "1–2 years", value: 1 },
  { label: "3–5 years", value: 3 },
  { label: "5–10 years", value: 5 },
  { label: "10+ years", value: 10 },
];
const STEPS = ["BJJ profile", "Experience", "Preferences"];

type ExperienceForm = WorkExperienceInput & { isCurrent: boolean };

const emptyExperience = (): ExperienceForm => ({
  position: "",
  organization: "",
  description: "",
  reasonLeft: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
});

export default function CoachRegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoaded, userId } = useAuth();
  const [checkingAccount, setCheckingAccount] = useState(true);
  const [wrongAccount, setWrongAccount] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedBelt, setSelectedBelt] = useState("BROWN");
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(["Gi", "No-Gi"]);
  const [affiliation, setAffiliation] = useState("");
  const [instagram, setInstagram] = useState("");
  const [yearsTeaching, setYearsTeaching] = useState(5);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [targetCity, setTargetCity] = useState("");
  const [location, setLocation] = useState<CoachLocationInput>(emptyCoachLocation());
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [uploadingResume, setUploadingResume] = useState(false);
  const [experiences, setExperiences] = useState<ExperienceForm[]>([emptyExperience()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleSpec = (s: string) =>
    setSelectedSpecs((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      router.replace("/register/coach/account");
      return;
    }

    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.role === "GYM" && data.gym) {
          setWrongAccount(true);
        } else if (data.role === "COACH" && data.coach) {
          router.replace("/dashboard");
        }
      })
      .finally(() => setCheckingAccount(false));
  }, [isLoaded, userId, router]);

  useEffect(() => {
    const pendingPhoto = readStored("pendingCoachPhoto");
    if (pendingPhoto) {
      setPhotoUrl((current) => current || pendingPhoto);
    }
  }, []);

  function handlePhotoChange(url: string | null) {
    setPhotoUrl(url);
    if (typeof window === "undefined") return;
    if (url) {
      sessionStorage.setItem(STORAGE_KEYS.pendingCoachPhoto, url);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.pendingCoachPhoto);
    }
  }

  function updateExperience(index: number, field: keyof ExperienceForm, value: string | boolean) {
    setExperiences((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
    );
  }

  async function handleResumeUpload(file: File) {
    setUploadingResume(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await fetch("/api/coach/resume", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setResumeUrl(data.resumeUrl);
        setResumeFileName(data.resumeFileName);
      } else {
        setError(data.error || "Failed to upload resume");
      }
    } catch {
      setError("Failed to upload resume. Please try again.");
    } finally {
      setUploadingResume(false);
    }
  }

  function validateStep1() {
    if (!firstName || !lastName) {
      setError("Please enter your first and last name");
      return false;
    }
    return true;
  }

  function validateStep2() {
    if (resumeUrl) return true;

    const filled = experiences.filter(
      (exp) =>
        exp.position.trim() ||
        exp.organization.trim() ||
        exp.description.trim() ||
        exp.startDate ||
        exp.endDate
    );

    if (filled.length === 0) {
      setError("Upload a PDF resume or add at least one work experience entry");
      return false;
    }

    for (let i = 0; i < experiences.length; i++) {
      const exp = experiences[i];
      const hasContent =
        exp.position.trim() ||
        exp.organization.trim() ||
        exp.description.trim() ||
        exp.startDate ||
        exp.endDate;

      if (!hasContent) continue;

      const label = `Position ${i + 1}`;

      if (!exp.position.trim()) {
        setError(`${label}: enter your job title`);
        return false;
      }
      if (!exp.organization.trim()) {
        setError(`${label}: enter the gym or organization name`);
        return false;
      }
      if (!exp.description.trim()) {
        setError(`${label}: describe what you did in this role`);
        return false;
      }
      if (!exp.startDate) {
        setError(`${label}: select a start date`);
        return false;
      }
      if (!exp.isCurrent && !exp.endDate) {
        setError(`${label}: select an end date or check "I currently work here"`);
        return false;
      }
    }

    return true;
  }

  function validateStep3() {
    const validationError = validateCoachLocation(location, {
      us: "Please enter your city and state",
      international: "Please enter your city, state/province, and country",
    });
    if (validationError) {
      setError(validationError);
      return false;
    }
    return true;
  }

  function goNext() {
    setError("");
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  }

  async function handleSubmit() {
    setError("");
    if (!validateStep2()) {
      setStep(2);
      return;
    }
    if (!validateStep3()) return;

    setSaving(true);
    try {
      const mapExperience = (exp: ExperienceForm) => ({
        position: exp.position.trim(),
        organization: exp.organization.trim(),
        description: exp.description.trim(),
        reasonLeft: exp.reasonLeft?.trim() || undefined,
        startDate: exp.startDate,
        endDate: exp.isCurrent ? undefined : exp.endDate || undefined,
        isCurrent: exp.isCurrent,
      });

      const completeExperiences = experiences
        .filter(
          (exp) =>
            exp.position.trim() &&
            exp.organization.trim() &&
            exp.description.trim() &&
            exp.startDate &&
            (exp.isCurrent || exp.endDate)
        )
        .map(mapExperience);

      const savedPhotoUrl = photoUrl || readStored("pendingCoachPhoto");

      const payload = {
        firstName,
        lastName,
        photoUrl: savedPhotoUrl || undefined,
        beltRank: selectedBelt,
        affiliation,
        instagram: instagram || undefined,
        yearsTeaching,
        specialties: selectedSpecs,
        targetCity,
        ...coachLocationToPayload(location),
        resumeUrl: resumeUrl || undefined,
        resumeFileName: resumeFileName || undefined,
        experiences: completeExperiences,
      };

      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        sessionStorage.removeItem(STORAGE_KEYS.signupRole);
        sessionStorage.removeItem(STORAGE_KEYS.pendingCoachPhoto);
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!isLoaded || checkingAccount) {
    return (
      <div className="min-h-screen bg-grouped flex items-center justify-center">
        <div className="text-footnote text-label-tertiary">Loading...</div>
      </div>
    );
  }

  if (wrongAccount) {
    return (
      <div className="min-h-screen bg-grouped flex items-center justify-center px-6">
        <div className="max-w-md text-center ios-card-lg p-8">
          <div className="text-3xl mb-4">🥋</div>
          <h1 className="text-title-2 mb-2">This account is a gym</h1>
          <p className="text-subheadline text-label-secondary mb-8 leading-relaxed">
            You&apos;re signed in with a gym account. Coach and gym profiles use separate
            accounts — sign out and create a new account with a different email to register
            as a coach.
          </p>
          <div className="flex flex-col gap-3">
            <SignOutButton redirectUrl="/register/coach/account">
              <button className="btn-primary w-full">Sign out & create coach account</button>
            </SignOutButton>
            <Link href="/dashboard" className="btn-secondary w-full text-center">
              Go to gym dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grouped">
      <div className="sticky top-0 z-50 px-4 py-3 bg-grouped-secondary/90 backdrop-blur-xl border-b border-separator/30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <Logo />
          <div className="hidden sm:flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                {i > 0 && <div className="w-6 h-px bg-separator/40" />}
                <div
                  className={`step-dot ${
                    step > i + 1 ? "step-dot-done" : step === i + 1 ? "step-dot-active" : "step-dot-pending"
                  }`}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span
                  className={`text-caption-1 ${
                    step === i + 1 ? "text-brand-dark font-semibold" : "text-label-tertiary"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="text-caption-1 text-label-tertiary">Step {step} of 3</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-0 lg:gap-6 px-4 py-6">
        <div className="ios-card-lg p-6 mb-6 lg:mb-0 h-fit">
          <div className="text-headline font-semibold mb-1">Build your coach profile</div>
          <div className="text-footnote text-label-secondary leading-relaxed mb-6">
            Gyms want to see your belt rank and your teaching history before they hire. A complete
            profile gets significantly more responses.
          </div>
          {[
            { icon: ShieldCheck, title: "Belt & specialties", sub: "Show your rank and what you teach best" },
            { icon: Briefcase, title: "Resume or experience", sub: "Upload a PDF or list past coaching roles" },
            { icon: Eye, title: "Visible to gyms", sub: "Owners review your full background before hiring" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-ios flex items-center justify-center shrink-0 bg-brand-light">
                <item.icon className="w-4 h-4 text-brand" />
              </div>
              <div>
                <div className="text-caption-1 font-semibold">{item.title}</div>
                <div className="text-caption-1 text-label-secondary leading-relaxed">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl">
          {error && <div className="alert-error mb-4">{error}</div>}

          {/* Step 1 — BJJ profile */}
          {step === 1 && (
            <>
              <h1 className="text-title-2 mb-1">Your BJJ background</h1>
              <p className="text-subheadline text-label-secondary mb-7">Tell gyms who you are on and off the mat</p>

              <div className="mb-6">
                <ProfilePhotoUpload
                  kind="photo"
                  value={photoUrl}
                  onChange={handlePhotoChange}
                  alt={`${firstName || "Coach"} ${lastName || "photo"}`.trim()}
                  fallback={
                    firstName && lastName ? (
                      <>
                        {firstName[0]}
                        {lastName[0]}
                      </>
                    ) : (
                      "🥋"
                    )
                  }
                  label="Profile photo"
                  hint="A clear headshot helps gyms recognize you. JPG, PNG, or WebP · max 2 MB · optional"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="field-label">First name</label>
                  <input
                    className="ios-field w-full"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">Last name</label>
                  <input
                    className="ios-field w-full"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="field-label">Belt rank</label>
                <div className="flex gap-2 flex-wrap">
                  {BELTS.map((belt) => (
                    <button
                      key={belt}
                      type="button"
                      onClick={() => setSelectedBelt(belt)}
                      className={`chip-toggle ${selectedBelt === belt ? "chip-toggle-active" : ""}`}
                      style={{ borderLeftWidth: "4px", borderLeftColor: BELT_COLORS[belt] }}
                    >
                      {BELT_LABELS[belt]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="field-label">
                    Affiliation <span className="font-normal text-label-tertiary">· optional</span>
                  </label>
                  <input
                    className="ios-field w-full"
                    placeholder="e.g. Alliance, Gracie Barra..."
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">Years teaching</label>
                  <select
                    className="ios-field w-full"
                    value={yearsTeaching}
                    onChange={(e) => setYearsTeaching(Number(e.target.value))}
                  >
                    {YEARS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-5">
                <label className="field-label">
                  Instagram <span className="font-normal text-label-tertiary">· optional</span>
                </label>
                <input
                  className="ios-field w-full"
                  placeholder="@yourhandle or instagram.com/yourhandle"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
                <p className="text-caption-1 text-label-tertiary mt-1.5">
                  Gyms often review your teaching clips and competition footage on Instagram.
                </p>
              </div>

              <div className="mb-7">
                <label className="field-label">Specialties</label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSpec(s)}
                      className={`chip-toggle ${selectedSpecs.includes(s) ? "chip-toggle-active" : ""}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 2 — Experience */}
          {step === 2 && (
            <>
              <h1 className="text-title-2 mb-1">Teaching experience</h1>
              <p className="text-subheadline text-label-secondary mb-7">
                Upload your resume as a PDF, or add your coaching roles manually. Gyms use this to
                evaluate your background before reaching out.
              </p>

              <div className="mb-6">
                <label className="field-label">Resume (PDF)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleResumeUpload(file);
                  }}
                />

                {resumeUrl ? (
                  <div className="flex items-center gap-3 p-4 rounded-ios ios-card">
                    <div className="w-10 h-10 rounded-ios flex items-center justify-center bg-brand-light">
                      <FileText className="w-5 h-5 text-brand" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-subheadline font-semibold truncate">{resumeFileName}</div>
                      <div className="text-footnote text-label-secondary">Resume uploaded</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setResumeUrl("");
                        setResumeFileName("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="p-1.5 rounded-ios hover:bg-fill-tertiary tap"
                    >
                      <X className="w-4 h-4 text-label-tertiary" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingResume}
                    className="w-full flex flex-col items-center gap-2 p-6 rounded-ios border-2 border-dashed border-separator/40 hover:border-brand transition-colors ios-card disabled:opacity-60 tap"
                  >
                    <Upload className="w-5 h-5 text-label-tertiary" />
                    <span className="text-subheadline text-label-secondary">
                      {uploadingResume ? "Uploading..." : "Click to upload your resume (PDF, max 5 MB)"}
                    </span>
                  </button>
                )}
              </div>

              {!resumeUrl && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-separator/40" />
                    <span className="text-caption-1 text-label-tertiary">or add experience manually</span>
                    <div className="flex-1 h-px bg-separator/40" />
                  </div>

                  <div className="space-y-4 mb-4">
                    {experiences.map((exp, index) => (
                      <div key={index} className="ios-card p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-caption-1 font-semibold text-label-secondary">
                            Position {index + 1}
                          </span>
                          {experiences.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setExperiences((prev) => prev.filter((_, i) => i !== index))
                              }
                              className="text-caption-1 text-label-tertiary hover:text-red-500 flex items-center gap-1 tap"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="field-label">Position</label>
                            <input
                              className="ios-field w-full"
                              placeholder="e.g. Head Coach"
                              value={exp.position}
                              onChange={(e) => updateExperience(index, "position", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="field-label">Gym / organization</label>
                            <input
                              className="ios-field w-full"
                              placeholder="e.g. Alliance Dallas"
                              value={exp.organization}
                              onChange={(e) => updateExperience(index, "organization", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="field-label">What you did</label>
                          <textarea
                            className="ios-field w-full resize-none"
                            rows={3}
                            placeholder="Classes taught, programs you ran, student growth, competition results..."
                            value={exp.description}
                            onChange={(e) => updateExperience(index, "description", e.target.value)}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="field-label">
                            Why you left <span className="font-normal text-label-tertiary">· optional</span>
                          </label>
                          <input
                            className="ios-field w-full"
                            placeholder="e.g. Relocated, pursued competition full-time..."
                            value={exp.reasonLeft}
                            onChange={(e) => updateExperience(index, "reasonLeft", e.target.value)}
                          />
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="field-label">From</label>
                            <input
                              type="month"
                              className="ios-field w-full min-h-[44px]"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                            />
                          </div>

                          <label className="flex items-center gap-2.5 py-1 text-subheadline text-label-secondary tap">
                            <input
                              type="checkbox"
                              className="w-[18px] h-[18px] shrink-0 accent-brand"
                              checked={exp.isCurrent}
                              onChange={(e) => {
                                updateExperience(index, "isCurrent", e.target.checked);
                                if (e.target.checked) updateExperience(index, "endDate", "");
                              }}
                            />
                            I currently work here
                          </label>

                          {!exp.isCurrent && (
                            <div>
                              <label className="field-label">To</label>
                              <input
                                type="month"
                                className="ios-field w-full min-h-[44px]"
                                value={exp.endDate}
                                min={exp.startDate || undefined}
                                onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setExperiences((prev) => [...prev, emptyExperience()])}
                    className="flex items-center gap-1.5 text-subheadline font-semibold text-brand mb-6 tap"
                  >
                    <Plus className="w-4 h-4" /> Add another position
                  </button>
                </>
              )}

              {resumeUrl && (
                <p className="text-footnote text-label-secondary">
                  Your resume is all gyms need. You can continue to the next step.
                </p>
              )}
            </>
          )}

          {/* Step 3 — Preferences */}
          {step === 3 && (
            <>
              <h1 className="text-title-2 mb-1">Job preferences</h1>
              <p className="text-subheadline text-label-secondary mb-7">
                Where you live now and where you want to coach
              </p>

              <div className="mb-6">
                <label className="field-label">Current address</label>
                <p className="text-caption-1 text-label-tertiary mb-3">
                  Gyms use this to see where you&apos;re located today.
                </p>
                <CoachLocationFields value={location} onChange={setLocation} />
              </div>

              <div className="mb-7">
                <label className="field-label">Target city</label>
                <p className="text-caption-1 text-label-tertiary mb-3">
                  Where you&apos;re looking for coaching work (can differ from where you live).
                </p>
                <input
                  className="ios-field w-full"
                  placeholder="e.g. Miami, FL or Dallas, TX"
                  value={targetCity}
                  onChange={(e) => setTargetCity(e.target.value)}
                />
              </div>

              <div className="alert-brand mb-6">
                <div className="text-subheadline font-semibold mb-1">Profile summary</div>
                <div className="text-caption-1 leading-relaxed">
                  {firstName} {lastName} · {BELT_LABELS[selectedBelt]}
                  {resumeUrl ? " · Resume uploaded" : ` · ${experiences.filter((e) => e.position).length} experience entries`}
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-6 mt-6 border-t border-separator/30">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep(step - 1);
                }}
                className="btn-secondary text-sm !py-2 !px-4"
              >
                ← Back
              </button>
            ) : (
              <Link href="/" className="btn-secondary text-sm !py-2 !px-4">
                ← Back
              </Link>
            )}

            {step < 3 ? (
              <button type="button" onClick={goNext} className="btn-primary text-sm !py-2 !px-5">
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="btn-primary text-sm !py-2 !px-5 disabled:opacity-60"
              >
                {saving ? "Creating profile..." : "Create profile →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
