"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { US_STATES } from "@/lib/utils";
import { DashboardNav } from "@/components/ui/dashboard-nav";

const STYLES = ["Gi", "No-Gi", "Kids program", "Competition team", "Self-defense", "Fundamentals"];
const PERKS = ["Free membership", "Flexible schedule", "Competition support", "Health benefits", "Seminar opportunities", "Growth potential"];
const PLANS = [
  { name: "Free", price: "$0", desc: "1 active listing · standard placement" },
  { name: "Featured", price: "$39/mo", desc: "Unlimited listings · top of search · badge" },
  { name: "Pro gym", price: "$79/mo", desc: "Everything + gym profile page + analytics" },
];

export default function PostJobPage() {
  const router = useRouter();
  const [checkingGym, setCheckingGym] = useState(true);
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
  const [selectedPlan, setSelectedPlan] = useState("Free");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/gym")
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setGymName(data.name);
          setCity(data.city);
          setState(data.state);
        } else {
          router.replace("/register/gym");
        }
      })
      .catch(() => router.replace("/register/gym"))
      .finally(() => setCheckingGym(false));
  }, [router]);

  const toggleStyle = (s: string) =>
    setSelectedStyles((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  const togglePerk = (s: string) =>
    setSelectedPerks((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  async function handlePublish() {
    if (!title || !city || !state || !description) {
      setError("Please fill in title, city, state, and description");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        }),
      });
      if (res.ok) {
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

  if (checkingGym) {
    return (
      <div className="min-h-screen bg-grouped flex items-center justify-center">
        <div className="text-footnote text-label-tertiary">Loading...</div>
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
              Post a job
            </div>
            <div className="text-headline font-semibold">New listing</div>
          </div>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="btn-primary text-sm !py-2 !px-5 disabled:opacity-60"
          >
            {saving ? "Publishing..." : "Publish listing"}
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
              Posting as <span className="font-semibold">{gymName}</span>
            </span>
          </div>

          <section className="ios-card-lg p-6">
            <h2 className="text-title-2 mb-1">Job details</h2>
            <p className="text-footnote text-label-secondary mb-6">
              This is what coaches will see when browsing listings
            </p>

            <div className="mb-5">
              <label className="field-label">Job title</label>
              <input
                className="ios-field"
                placeholder="e.g. Head BJJ Coach, Kids Instructor"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="field-label">Job type</label>
                <select className="ios-field" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="REVENUE_SHARE">Revenue share</option>
                </select>
              </div>
              <div>
                <label className="field-label">City</label>
                <input
                  className="ios-field"
                  placeholder="Dallas"
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
          </section>

          <section className="ios-card-lg p-6">
            <h2 className="text-title-2 mb-1">Requirements</h2>
            <p className="text-footnote text-label-secondary mb-5">
              Set the minimum belt rank and experience required
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="field-label">Minimum belt rank</label>
                <select className="ios-field" value={minBelt} onChange={(e) => setMinBelt(e.target.value)}>
                  <option value="WHITE">Any belt</option>
                  <option value="BLUE">Blue belt+</option>
                  <option value="PURPLE">Purple belt+</option>
                  <option value="BROWN">Brown belt+</option>
                  <option value="BLACK">Black belt only</option>
                </select>
              </div>
              <div>
                <label className="field-label">Teaching experience</label>
                <select
                  className="ios-field"
                  value={minYears}
                  onChange={(e) => setMinYears(Number(e.target.value))}
                >
                  <option value={0}>No minimum</option>
                  <option value={1}>1+ years</option>
                  <option value={2}>2+ years</option>
                  <option value={5}>5+ years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="field-label">Style preference</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleStyle(s)}
                    className={`chip-toggle ${selectedStyles.includes(s) ? "chip-toggle-active" : ""}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="ios-card-lg p-6">
            <h2 className="text-title-2 mb-1">Compensation</h2>
            <p className="text-footnote text-label-secondary mb-5">
              Listings with pay ranges get 2x more applications
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div>
                <label className="field-label">Pay type</label>
                <select className="ios-field" value={payType} onChange={(e) => setPayType(e.target.value)}>
                  <option value="monthly">Monthly salary</option>
                  <option value="hourly">Hourly rate</option>
                  <option value="revenue_share">Revenue share</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>
              <div>
                <label className="field-label">Min</label>
                <input
                  className="ios-field"
                  placeholder="25"
                  value={minPay}
                  onChange={(e) => setMinPay(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Max</label>
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
                Job description{" "}
                <span className="font-normal text-label-tertiary">· What will this coach do day to day?</span>
              </label>
              <textarea
                className="ios-field"
                rows={4}
                placeholder="Describe the role, schedule, class sizes, team culture..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label">
                Perks & benefits <span className="font-normal text-label-tertiary">· optional</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PERKS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePerk(p)}
                    className={`chip-toggle ${selectedPerks.includes(p) ? "chip-toggle-active" : ""}`}
                  >
                    {p}
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
            {saving ? "Publishing..." : "Publish listing"}
          </button>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-32 lg:self-start">
          <div className="text-caption-1 font-semibold uppercase tracking-wider text-label-tertiary">
            Live preview
          </div>
          <div className="ios-card p-4">
            <div className="text-headline font-semibold mb-1">{title || "Job title"}</div>
            <div className="flex items-center gap-1 text-footnote text-label-secondary mb-3">
              <Building2 className="w-3.5 h-3.5 text-brand" />
              {gymName} · {city || "City"}, {state || "State"}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="chip chip-active">
                {jobType.replace("_", "-").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
              </span>
              {selectedStyles.slice(0, 2).map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
            <div className="text-headline font-semibold">
              {minPay && maxPay
                ? `$${minPay}–$${maxPay}/${payType === "monthly" ? "mo" : "hr"}`
                : minPay
                ? `$${minPay}+`
                : "Pay negotiable"}
            </div>
          </div>

          <div className="text-footnote font-semibold text-label-secondary">Choose a plan</div>
          <div className="flex flex-col gap-2">
            {PLANS.map((plan) => (
              <button
                key={plan.name}
                type="button"
                onClick={() => setSelectedPlan(plan.name)}
                className={`text-left ios-card p-4 transition-all tap ${
                  selectedPlan === plan.name ? "ring-2 ring-brand" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-headline font-semibold">{plan.name}</span>
                  <span className="text-headline font-semibold text-brand">{plan.price}</span>
                </div>
                <div className="text-footnote text-label-secondary">{plan.desc}</div>
              </button>
            ))}
          </div>

          <div className="alert-brand">
            <div className="text-footnote font-semibold mb-1">Pro tip</div>
            <div className="text-caption-1 leading-relaxed">
              Listings with a pay range, belt minimum, and description get filled 40% faster on average.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
