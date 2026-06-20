"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth, SignOutButton } from "@clerk/nextjs";
import {
  Shield,
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
  const [yearsTeaching, setYearsTeaching] = useState(5);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [targetCity, setTargetCity] = useState("");
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
      router.replace("/register?role=coach");
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

    const valid = experiences.filter(
      (exp) =>
        exp.position.trim() &&
        exp.organization.trim() &&
        exp.description.trim() &&
        exp.startDate
    );

    if (valid.length === 0) {
      setError("Upload a PDF resume or add at least one complete work experience entry");
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

    setSaving(true);
    try {
      const payload = {
        firstName,
        lastName,
        beltRank: selectedBelt,
        affiliation,
        yearsTeaching,
        specialties: selectedSpecs,
        targetCity,
        resumeUrl: resumeUrl || undefined,
        resumeFileName: resumeFileName || undefined,
        experiences: resumeUrl
          ? experiences
              .filter(
                (exp) =>
                  exp.position.trim() &&
                  exp.organization.trim() &&
                  exp.description.trim() &&
                  exp.startDate
              )
              .map((exp) => ({
                position: exp.position.trim(),
                organization: exp.organization.trim(),
                description: exp.description.trim(),
                reasonLeft: exp.reasonLeft?.trim() || undefined,
                startDate: exp.startDate,
                endDate: exp.isCurrent ? undefined : exp.endDate || undefined,
              }))
          : experiences
              .filter(
                (exp) =>
                  exp.position.trim() &&
                  exp.organization.trim() &&
                  exp.description.trim() &&
                  exp.startDate
              )
              .map((exp) => ({
                position: exp.position.trim(),
                organization: exp.organization.trim(),
                description: exp.description.trim(),
                reasonLeft: exp.reasonLeft?.trim() || undefined,
                startDate: exp.startDate,
                endDate: exp.isCurrent ? undefined : exp.endDate || undefined,
              })),
      };

      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        sessionStorage.removeItem("bjjjobs_signup_role");
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  if (wrongAccount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="text-3xl mb-4">🥋</div>
          <h1 className="text-xl font-medium mb-2">This account is a gym</h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            You&apos;re signed in with a gym account. Coach and gym profiles use separate
            accounts — sign out and create a new account with a different email to register
            as a coach.
          </p>
          <div className="flex flex-col gap-3">
            <SignOutButton redirectUrl="/register?role=coach">
              <button
                className="text-sm font-medium text-white px-6 py-3 rounded-xl w-full"
                style={{ background: "#1D9E75" }}
              >
                Sign out & create coach account
              </button>
            </SignOutButton>
            <Link
              href="/dashboard"
              className="text-sm px-6 py-3 rounded-xl border border-gray-200 text-gray-600"
            >
              Go to gym dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-7 py-3.5 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2 text-base font-medium">
          <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
          BJJJobs
        </Link>
        <div className="flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              {i > 0 && <div className="w-6 h-px bg-gray-200" />}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                style={
                  step > i + 1
                    ? { background: "#E1F5EE", color: "#0F6E56" }
                    : step === i + 1
                    ? { background: "#1D9E75", color: "#fff" }
                    : { background: "#f3f4f6", color: "#9ca3af", border: "0.5px solid #e5e7eb" }
                }
              >
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span
                className="text-xs"
                style={{
                  color: step === i + 1 ? "#0F6E56" : "#9ca3af",
                  fontWeight: step === i + 1 ? 500 : 400,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-400">Step {step} of 3</div>
      </div>

      <div className="grid grid-cols-[260px_1fr] min-h-[calc(100vh-57px)]">
        <div className="bg-white border-r border-gray-100 p-7">
          <div className="font-medium text-sm mb-1">Build your coach profile</div>
          <div className="text-xs text-gray-500 leading-relaxed mb-6">
            Gyms want to see your belt rank and your teaching history before they hire.
            A complete profile gets significantly more responses.
          </div>
          {[
            { icon: ShieldCheck, title: "Belt & specialties", sub: "Show your rank and what you teach best" },
            { icon: Briefcase, title: "Resume or experience", sub: "Upload a PDF or list past coaching roles" },
            { icon: Eye, title: "Visible to gyms", sub: "Owners review your full background before hiring" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#E1F5EE" }}
              >
                <item.icon className="w-4 h-4" style={{ color: "#1D9E75" }} />
              </div>
              <div>
                <div className="text-xs font-medium">{item.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 max-w-2xl">
          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-lg text-sm"
              style={{ background: "#FCEBEB", color: "#A32D2D" }}
            >
              {error}
            </div>
          )}

          {/* Step 1 — BJJ profile */}
          {step === 1 && (
            <>
              <h1 className="text-lg font-medium mb-1">Your BJJ background</h1>
              <p className="text-sm text-gray-500 mb-7">Tell gyms who you are on and off the mat</p>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">First name</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Last name</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-500 mb-2">Belt rank</label>
                <div className="flex gap-2 flex-wrap">
                  {BELTS.map((belt) => (
                    <button
                      key={belt}
                      type="button"
                      onClick={() => setSelectedBelt(belt)}
                      className="px-4 py-1.5 rounded-full text-xs font-medium border transition-all"
                      style={{
                        borderLeftWidth: "4px",
                        borderLeftColor: BELT_COLORS[belt],
                        borderTopColor: selectedBelt === belt ? "#1D9E75" : "#e5e7eb",
                        borderRightColor: selectedBelt === belt ? "#1D9E75" : "#e5e7eb",
                        borderBottomColor: selectedBelt === belt ? "#1D9E75" : "#e5e7eb",
                        background: selectedBelt === belt ? "#E1F5EE" : "white",
                        color: selectedBelt === belt ? "#0F6E56" : "#6b7280",
                      }}
                    >
                      {BELT_LABELS[belt]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Affiliation <span className="font-normal text-gray-400">· optional</span>
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
                    placeholder="e.g. Alliance, Gracie Barra..."
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Years teaching</label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
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

              <div className="mb-7">
                <label className="block text-xs font-medium text-gray-500 mb-2">Specialties</label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSpec(s)}
                      className="px-3.5 py-1.5 rounded-full text-xs border transition-all"
                      style={{
                        background: selectedSpecs.includes(s) ? "#E1F5EE" : "white",
                        borderColor: selectedSpecs.includes(s) ? "#1D9E75" : "#e5e7eb",
                        color: selectedSpecs.includes(s) ? "#0F6E56" : "#6b7280",
                      }}
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
              <h1 className="text-lg font-medium mb-1">Teaching experience</h1>
              <p className="text-sm text-gray-500 mb-7">
                Upload your resume as a PDF, or add your coaching roles manually. Gyms use
                this to evaluate your background before reaching out.
              </p>

              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-500 mb-2">Resume (PDF)</label>
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
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: "#E1F5EE" }}
                    >
                      <FileText className="w-5 h-5" style={{ color: "#1D9E75" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{resumeFileName}</div>
                      <div className="text-xs text-gray-500">Resume uploaded</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setResumeUrl("");
                        setResumeFileName("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="p-1.5 rounded-lg hover:bg-gray-100"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingResume}
                    className="w-full flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-green-400 transition-colors bg-white disabled:opacity-60"
                  >
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {uploadingResume ? "Uploading..." : "Click to upload your resume (PDF, max 5 MB)"}
                    </span>
                  </button>
                )}
              </div>

              {!resumeUrl && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400">or add experience manually</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  <div className="space-y-4 mb-4">
                    {experiences.map((exp, index) => (
                      <div key={index} className="p-4 rounded-xl border border-gray-200 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-gray-500">
                            Position {index + 1}
                          </span>
                          {experiences.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setExperiences((prev) => prev.filter((_, i) => i !== index))
                              }
                              className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Position</label>
                            <input
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
                              placeholder="e.g. Head Coach"
                              value={exp.position}
                              onChange={(e) => updateExperience(index, "position", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Gym / organization</label>
                            <input
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
                              placeholder="e.g. Alliance Dallas"
                              value={exp.organization}
                              onChange={(e) => updateExperience(index, "organization", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-500 mb-1">What you did</label>
                          <textarea
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 resize-none"
                            rows={3}
                            placeholder="Classes taught, programs you ran, student growth, competition results..."
                            value={exp.description}
                            onChange={(e) => updateExperience(index, "description", e.target.value)}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Why you left <span className="font-normal text-gray-400">· optional</span>
                          </label>
                          <input
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
                            placeholder="e.g. Relocated, pursued competition full-time..."
                            value={exp.reasonLeft}
                            onChange={(e) => updateExperience(index, "reasonLeft", e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                            <input
                              type="month"
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                            <input
                              type="month"
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 disabled:bg-gray-50"
                              value={exp.endDate}
                              disabled={exp.isCurrent}
                              onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                            />
                            <label className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                              <input
                                type="checkbox"
                                checked={exp.isCurrent}
                                onChange={(e) => {
                                  updateExperience(index, "isCurrent", e.target.checked);
                                  if (e.target.checked) updateExperience(index, "endDate", "");
                                }}
                              />
                              I currently work here
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setExperiences((prev) => [...prev, emptyExperience()])}
                    className="flex items-center gap-1.5 text-sm font-medium mb-6"
                    style={{ color: "#1D9E75" }}
                  >
                    <Plus className="w-4 h-4" /> Add another position
                  </button>
                </>
              )}

              {resumeUrl && (
                <p className="text-xs text-gray-500">
                  Your resume is all gyms need. You can continue to the next step.
                </p>
              )}
            </>
          )}

          {/* Step 3 — Preferences */}
          {step === 3 && (
            <>
              <h1 className="text-lg font-medium mb-1">Job preferences</h1>
              <p className="text-sm text-gray-500 mb-7">Where are you looking to coach?</p>

              <div className="mb-7">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Target city</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
                  placeholder="e.g. Miami, FL or Dallas, TX"
                  value={targetCity}
                  onChange={(e) => setTargetCity(e.target.value)}
                />
              </div>

              <div className="rounded-xl p-4 mb-6" style={{ background: "#E1F5EE" }}>
                <div className="text-sm font-medium mb-1" style={{ color: "#0F6E56" }}>
                  Profile summary
                </div>
                <div className="text-xs leading-relaxed" style={{ color: "#0F6E56" }}>
                  {firstName} {lastName} · {BELT_LABELS[selectedBelt]}
                  {resumeUrl ? " · Resume uploaded" : ` · ${experiences.filter((e) => e.position).length} experience entries`}
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep(step - 1);
                }}
                className="text-sm px-5 py-2 border border-gray-200 rounded-lg text-gray-500"
              >
                ← Back
              </button>
            ) : (
              <Link href="/" className="text-sm px-5 py-2 border border-gray-200 rounded-lg text-gray-500">
                ← Back
              </Link>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="text-sm font-medium text-white px-6 py-2 rounded-lg"
                style={{ background: "#1D9E75" }}
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="text-sm font-medium text-white px-6 py-2 rounded-lg disabled:opacity-60"
                style={{ background: "#1D9E75" }}
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
