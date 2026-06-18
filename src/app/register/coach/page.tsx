"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, SignOutButton } from "@clerk/nextjs";
import { Shield, ShieldCheck, MapPin, Eye } from "lucide-react";
import Link from "next/link";

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

export default function CoachRegisterPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const [checkingAccount, setCheckingAccount] = useState(true);
  const [wrongAccount, setWrongAccount] = useState(false);
  const [selectedBelt, setSelectedBelt] = useState("BROWN");
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(["Gi", "No-Gi"]);
  const [affiliation, setAffiliation] = useState("");
  const [yearsTeaching, setYearsTeaching] = useState(5);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [targetCity, setTargetCity] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleSpec = (s: string) =>
    setSelectedSpecs((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

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

  async function handleSubmit() {
    if (!firstName || !lastName) { setError("Please enter your name"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          beltRank: selectedBelt,
          affiliation,
          yearsTeaching,
          specialties: selectedSpecs,
          targetCity,
        }),
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
          {["Account", "BJJ profile", "Preferences"].map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              {i > 0 && <div className="w-6 h-px bg-gray-200" />}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                style={
                  i === 0 ? { background: "#E1F5EE", color: "#0F6E56" }
                  : i === 1 ? { background: "#1D9E75", color: "#fff" }
                  : { background: "#f3f4f6", color: "#9ca3af", border: "0.5px solid #e5e7eb" }
                }
              >
                {i === 0 ? "✓" : i + 1}
              </div>
              <span className="text-xs" style={{ color: i === 1 ? "#0F6E56" : "#9ca3af", fontWeight: i === 1 ? 500 : 400 }}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-400">Step 2 of 3</div>
      </div>

      <div className="grid grid-cols-[260px_1fr] min-h-[calc(100vh-57px)]">
        <div className="bg-white border-r border-gray-100 p-7">
          <div className="font-medium text-sm mb-1">Build your coach profile</div>
          <div className="text-xs text-gray-500 leading-relaxed mb-6">
            Gyms browse profiles to find coaches. A complete profile gets 3x more views.
          </div>
          {[
            { icon: ShieldCheck, title: "Belt verification", sub: "We verify credentials with your affiliation" },
            { icon: MapPin, title: "Location matching", sub: "Get matched to jobs in your target city" },
            { icon: Eye, title: "Visible to 180+ gyms", sub: "Gyms can reach out directly to you" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#E1F5EE" }}>
                <item.icon className="w-4 h-4" style={{ color: "#1D9E75" }} />
              </div>
              <div>
                <div className="text-xs font-medium">{item.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 max-w-xl">
          <h1 className="text-lg font-medium mb-1">Your BJJ background</h1>
          <p className="text-sm text-gray-500 mb-7">Tell gyms who you are on and off the mat</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: "#FCEBEB", color: "#A32D2D" }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">First name</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
                placeholder="Lucas"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Last name</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
                placeholder="Lisboa"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="h-px bg-gray-100 my-5" />

          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-2">Belt rank</label>
            <div className="flex gap-2 flex-wrap">
              {BELTS.map((belt) => (
                <button
                  key={belt}
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
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Affiliation <span className="font-normal text-gray-400">· optional</span></label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
                placeholder="e.g. Alliance, Gracie Barra, Independent..."
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
                {YEARS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="h-px bg-gray-100 my-5" />

          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-2">Specialties</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map((s) => (
                <button
                  key={s}
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

          <div className="mb-7">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Target city</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
              placeholder="e.g. Miami, FL or Dallas, TX"
              value={targetCity}
              onChange={(e) => setTargetCity(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm px-5 py-2 border border-gray-200 rounded-lg text-gray-500">
              ← Back
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="text-sm font-medium text-white px-6 py-2 rounded-lg disabled:opacity-60"
              style={{ background: "#1D9E75" }}
            >
              {saving ? "Saving..." : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
