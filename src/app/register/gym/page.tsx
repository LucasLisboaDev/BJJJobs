"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { US_STATES } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

export default function GymRegisterPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [checkingAccount, setCheckingAccount] = useState(true);
  const [wrongAccount, setWrongAccount] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [website, setWebsite] = useState("");
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
    const stored = sessionStorage.getItem("bjjjobs_gym_name");
    if (stored?.trim()) setName(stored.trim());
  }, [user, name]);

  async function handleSubmit() {
    if (!name || !city || !state) {
      setError("Please fill in gym name, city, and state");
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
          city,
          state,
          affiliation: affiliation || undefined,
          website: website || undefined,
          description: description || undefined,
        }),
      });
      if (res.ok) {
        sessionStorage.removeItem("bjjjobs_gym_name");
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
      <div className="min-h-screen bg-grouped flex items-center justify-center">
        <div className="text-footnote text-label-tertiary">Loading...</div>
      </div>
    );
  }

  if (wrongAccount) {
    return (
      <div className="min-h-screen bg-grouped flex items-center justify-center px-6">
        <div className="max-w-md text-center ios-card-lg p-8">
          <div className="text-3xl mb-4">🏋️</div>
          <h1 className="text-title-2 mb-2">This account is a coach</h1>
          <p className="text-subheadline text-label-secondary mb-8 leading-relaxed">
            You&apos;re signed in with a coach account. Coach and gym profiles use separate accounts
            — sign out and create a new account with a different email to register a gym.
          </p>
          <div className="flex flex-col gap-3">
            <SignOutButton redirectUrl="/register/gym/account">
              <button className="btn-primary w-full">Sign out & create gym account</button>
            </SignOutButton>
            <Link href="/dashboard" className="btn-secondary w-full text-center">
              Go to coach dashboard
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
          <div className="text-caption-1 text-label-tertiary">Gym registration</div>
        </div>
      </div>

      <div className="page-col max-w-lg">
        <h1 className="text-title-1 mb-2">Create your gym profile</h1>
        <p className="text-subheadline text-label-secondary mb-8">
          Set up your gym profile first. You&apos;ll land on your dashboard where you can manage your
          info and post jobs when you&apos;re ready.
        </p>

        {error && <div className="alert-error mb-5">{error}</div>}

        <div className="ios-card-lg p-6 space-y-5">
          <div>
            <label className="field-label">Gym name</label>
            <input
              className="ios-field"
              placeholder="e.g. Alliance Miami"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">City</label>
              <input
                className="ios-field"
                placeholder="Miami"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">State</label>
              <select className="ios-field" value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">Select state</option>
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
              Affiliation <span className="font-normal text-label-tertiary">· optional</span>
            </label>
            <input
              className="ios-field"
              placeholder="e.g. Alliance, Gracie Barra, Independent..."
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">
              Website <span className="font-normal text-label-tertiary">· optional</span>
            </label>
            <input
              className="ios-field"
              placeholder="https://yourgym.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">
              About your gym <span className="font-normal text-label-tertiary">· optional</span>
            </label>
            <textarea
              className="ios-field"
              rows={3}
              placeholder="Tell coaches about your gym culture, schedule, and what makes you a great place to work..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button onClick={handleSubmit} disabled={saving} className="btn-primary w-full disabled:opacity-60">
            {saving ? "Saving..." : "Create gym profile →"}
          </button>
        </div>
      </div>
    </div>
  );
}
