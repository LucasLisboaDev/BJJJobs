"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Shield, Search, Filter } from "lucide-react";

const BELT_LABELS: Record<string, string> = {
  WHITE: "White belt+", BLUE: "Blue belt+", PURPLE: "Purple belt+", BROWN: "Brown belt+", BLACK: "Black belt",
};
const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time", PART_TIME: "Part-time", CONTRACT: "Contract", REVENUE_SHARE: "Revenue share",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [belt, setBelt] = useState("");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city) params.set("city", city);
    if (belt) params.set("belt", belt);
    const res = await fetch(`/api/jobs?${params}`);
    const data = await res.json();
    setJobs(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [query, city, belt]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2 text-base font-medium">
          <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
          BJJJobs
        </Link>
        <Link href="/post-job" className="text-sm font-medium text-white px-4 py-2 rounded-lg" style={{ background: "#1D9E75" }}>
          Post a job
        </Link>
      </nav>

      <div className="px-8 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-medium mb-6">Browse coaching jobs</h1>

        <div className="flex items-center gap-3 mb-6 bg-white border border-gray-100 rounded-xl p-3">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              className="text-sm outline-none flex-1 bg-transparent"
              placeholder="Search jobs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="w-px h-5 bg-gray-200" />
          <input
            className="text-sm outline-none text-gray-500 bg-transparent w-32"
            placeholder="City..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <div className="w-px h-5 bg-gray-200" />
          <select
            className="text-sm outline-none text-gray-500 bg-transparent"
            value={belt}
            onChange={(e) => setBelt(e.target.value)}
          >
            <option value="">All belt levels</option>
            <option value="WHITE">White belt+</option>
            <option value="BLUE">Blue belt+</option>
            <option value="PURPLE">Purple belt+</option>
            <option value="BROWN">Brown belt+</option>
            <option value="BLACK">Black belt</option>
          </select>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg" onClick={fetchJobs}>
            <Filter className="w-4 h-4" />
            Search
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-sm text-gray-400">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-lg font-medium mb-2">No jobs found</div>
            <p className="text-sm text-gray-500 mb-6">Try adjusting your filters, or be the first to post a job.</p>
            <Link href="/post-job" className="text-sm font-medium text-white px-5 py-2.5 rounded-lg" style={{ background: "#1D9E75" }}>
              Post a job
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:border-green-300 transition-colors"
              >
                <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0" style={{ background: "#E1F5EE" }}>
                  🥋
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{job.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{job.gym?.name} · {job.city}, {job.state}</div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: "#E1F5EE", color: "#0F6E56" }}>
                      {JOB_TYPE_LABELS[job.jobType]}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {BELT_LABELS[job.minBelt]}
                    </span>
                    {job.styles?.slice(0, 2).map((s: string) => (
                      <span key={s} className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {job.featured && (
                    <div className="text-xs font-medium text-white px-2 py-0.5 rounded-full mb-1 inline-block" style={{ background: "#1D9E75" }}>Featured</div>
                  )}
                  <div className="text-sm font-medium">
                    {job.minPay ? `$${job.minPay}${job.payType === "monthly" ? "/mo" : "/hr"}` : "Negotiable"}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
