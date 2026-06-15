"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import Link from "next/link";
import { US_STATES } from "@/lib/utils";

export default function GymRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        body: JSON.stringify({ name, city, state, affiliation: affiliation || undefined, website: website || undefined, description: description || undefined }),
      });
      if (res.ok) {
        router.push("/post-job");
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
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-7 py-3.5 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2 text-base font-medium">
          <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
          BJJJobs
        </Link>
        <div className="text-xs text-gray-400">Gym registration</div>
      </div>

      <div className="max-w-lg mx-auto py-12 px-6">
        <h1 className="text-2xl font-medium mb-2">Create your gym profile</h1>
        <p className="text-sm text-gray-500 mb-8">Set up your gym so coaches can find you and apply to your listings</p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg text-sm" style={{ background: "#FCEBEB", color: "#A32D2D" }}>
            {error}
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Gym name</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400"
              placeholder="e.g. Alliance Miami"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">City</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400"
                placeholder="Miami"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
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

          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Affiliation <span className="font-normal text-gray-400">· optional</span>
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400"
              placeholder="e.g. Alliance, Gracie Barra, Independent..."
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Website <span className="font-normal text-gray-400">· optional</span>
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400"
              placeholder="https://yourgym.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              About your gym <span className="font-normal text-gray-400">· optional</span>
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400 resize-none"
              rows={3}
              placeholder="Tell coaches about your gym culture, schedule, and what makes you a great place to work..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full text-sm font-medium text-white py-2.5 rounded-lg disabled:opacity-60"
            style={{ background: "#1D9E75" }}
          >
            {saving ? "Saving..." : "Create gym profile →"}
          </button>
        </div>
      </div>
    </div>
  );
}
