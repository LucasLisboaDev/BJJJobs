"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Building2 } from "lucide-react";
import Link from "next/link";
import { US_STATES } from "@/lib/utils";

const STYLES = ["Gi", "No-Gi", "Kids program", "Competition team", "Self-defense", "Fundamentals"];
const PERKS = ["Free membership", "Flexible schedule", "Competition support", "Health benefits", "Seminar opportunities", "Growth potential"];
const PLANS = [
  { name: "Free", price: "$0", desc: "1 active listing · standard placement" },
  { name: "Featured", price: "$39/mo", desc: "Unlimited listings · top of search · badge" },
  { name: "Pro gym", price: "$79/mo", desc: "Everything + gym profile page + analytics" },
];

export default function PostJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState("FULL_TIME");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [minBelt, setMinBelt] = useState("PURPLE");
  const [minYears, setMinYears] = useState(2);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["Gi", "No-Gi"]);
  const [selectedPerks, setSelectedPerks] = useState<string[]>(["Flexible schedule", "Growth potential"]);
  const [payType, setPayType] = useState("hourly");
  const [minPay, setMinPay] = useState("");
  const [maxPay, setMaxPay] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("Featured");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleStyle = (s: string) =>
    setSelectedStyles((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);
  const togglePerk = (s: string) =>
    setSelectedPerks((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);

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
        const job = await res.json();
        router.push(`/jobs/${job.id}`);
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

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between px-7 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-base font-medium">
            <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
            BJJJobs
          </Link>
          <span className="text-xs text-gray-400 ml-1">/ Post a job</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1">
            <Building2 className="w-3.5 h-3.5" style={{ color: "#1D9E75" }} />
            <span className="text-xs text-gray-500">Your gym</span>
          </div>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="text-sm font-medium text-white px-4 py-1.5 rounded-lg disabled:opacity-60"
            style={{ background: "#1D9E75" }}
          >
            {saving ? "Publishing..." : "Publish listing"}
          </button>
        </div>
      </div>

      {error && (
        <div className="px-8 py-3 text-sm" style={{ background: "#FCEBEB", color: "#A32D2D" }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-[1fr_300px] min-h-[calc(100vh-57px)]">
        <div className="p-8 border-r border-gray-100 max-w-2xl">
          <h2 className="text-base font-medium mb-1">Job details</h2>
          <p className="text-xs text-gray-400 mb-6">This is what coaches will see when browsing listings</p>

          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Job title</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400"
              placeholder="e.g. Head BJJ Coach, Kids Instructor, Competition Team Coach"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Job type</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="REVENUE_SHARE">Revenue share</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">City</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400" placeholder="Miami" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">State</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400 bg-white"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="">Select state</option>
                {US_STATES.map((s) => (
                  <option key={s.abbr} value={s.abbr}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-px bg-gray-100 my-6" />
          <h2 className="text-base font-medium mb-1">Requirements</h2>
          <p className="text-xs text-gray-400 mb-5">Set the minimum belt rank and experience required</p>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Minimum belt rank</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none" value={minBelt} onChange={(e) => setMinBelt(e.target.value)}>
                <option value="WHITE">Any belt</option>
                <option value="BLUE">Blue belt+</option>
                <option value="PURPLE">Purple belt+</option>
                <option value="BROWN">Brown belt+</option>
                <option value="BLACK">Black belt only</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Teaching experience</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none" value={minYears} onChange={(e) => setMinYears(Number(e.target.value))}>
                <option value={0}>No minimum</option>
                <option value={1}>1+ years</option>
                <option value={2}>2+ years</option>
                <option value={5}>5+ years</option>
              </select>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-2">Style preference</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button key={s} onClick={() => toggleStyle(s)} className="px-3.5 py-1.5 rounded-full text-xs border transition-all"
                  style={{ background: selectedStyles.includes(s) ? "#E1F5EE" : "white", borderColor: selectedStyles.includes(s) ? "#1D9E75" : "#e5e7eb", color: selectedStyles.includes(s) ? "#0F6E56" : "#6b7280" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100 my-6" />
          <h2 className="text-base font-medium mb-1">Compensation</h2>
          <p className="text-xs text-gray-400 mb-5">Listings with pay ranges get 2x more applications</p>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Pay type</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none" value={payType} onChange={(e) => setPayType(e.target.value)}>
                <option value="monthly">Monthly salary</option>
                <option value="hourly">Hourly rate</option>
                <option value="revenue_share">Revenue share</option>
                <option value="negotiable">Negotiable</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Min</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400" placeholder="25" value={minPay} onChange={(e) => setMinPay(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Max</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400" placeholder="45" value={maxPay} onChange={(e) => setMaxPay(e.target.value)} />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Job description <span className="font-normal text-gray-400">· What will this coach actually do day to day?</span>
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400 resize-none"
              rows={4}
              placeholder="Describe the role, schedule, class sizes, team culture, and what makes your gym a great place to coach..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-500 mb-2">Perks & benefits <span className="font-normal text-gray-400">· optional</span></label>
            <div className="flex flex-wrap gap-2">
              {PERKS.map((p) => (
                <button key={p} onClick={() => togglePerk(p)} className="px-3.5 py-1.5 rounded-full text-xs border transition-all"
                  style={{ background: selectedPerks.includes(p) ? "#E1F5EE" : "white", borderColor: selectedPerks.includes(p) ? "#1D9E75" : "#e5e7eb", color: selectedPerks.includes(p) ? "#0F6E56" : "#6b7280" }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          <div className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">Live preview</div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
            <div className="font-medium text-sm mb-1">{title || "Job title"}</div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <Building2 className="w-3 h-3" style={{ color: "#1D9E75" }} />
              Your gym · {city || "City"}, {state || "State"}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#E1F5EE", color: "#0F6E56" }}>
                {jobType.replace("_", "-").toLowerCase().replace(/^\w/, c => c.toUpperCase())}
              </span>
              {selectedStyles.slice(0, 2).map(s => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{s}</span>
              ))}
            </div>
            <div className="text-sm font-medium">
              {minPay && maxPay ? `$${minPay}–$${maxPay}/${payType === "monthly" ? "mo" : "hr"}` : minPay ? `$${minPay}/${payType === "monthly" ? "mo" : "hr"}+` : "Pay negotiable"}
            </div>
          </div>

          <div className="text-xs font-medium text-gray-500 mb-3">Choose a plan</div>
          <div className="flex flex-col gap-2 mb-4">
            {PLANS.map((plan) => (
              <button key={plan.name} onClick={() => setSelectedPlan(plan.name)} className="text-left border rounded-xl p-3.5 transition-all bg-white"
                style={{ borderWidth: selectedPlan === plan.name ? "2px" : "0.5px", borderColor: selectedPlan === plan.name ? "#1D9E75" : "#e5e7eb" }}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-medium">{plan.name}</span>
                  <span className="text-sm font-medium" style={{ color: "#1D9E75" }}>{plan.price}</span>
                </div>
                <div className="text-xs text-gray-400">{plan.desc}</div>
              </button>
            ))}
          </div>

          <div className="rounded-xl p-3.5" style={{ background: "#E1F5EE" }}>
            <div className="text-xs font-medium mb-1" style={{ color: "#0F6E56" }}>💡 Pro tip</div>
            <div className="text-xs leading-relaxed" style={{ color: "#0F6E56" }}>
              Listings with a pay range, belt minimum, and description get filled 40% faster on average.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
