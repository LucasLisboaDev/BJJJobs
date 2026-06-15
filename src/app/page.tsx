import Link from "next/link";
import { Shield, Search, Users, Building2, ArrowRight, CheckCircle } from "lucide-react";

const FEATURED_JOBS = [
  {
    id: "1",
    title: "Head BJJ Coach",
    gym: "Alliance Jiu-Jitsu",
    city: "Miami, FL",
    type: "Full-time",
    belt: "Black belt preferred",
    pay: "$4,500/mo",
    postedAt: "2 days ago",
    isNew: true,
  },
  {
    id: "2",
    title: "Kids Program Instructor",
    gym: "Gracie Barra",
    city: "Austin, TX",
    type: "Part-time",
    belt: "Purple belt+",
    pay: "$28/hr",
    postedAt: "4 days ago",
    isNew: false,
  },
  {
    id: "3",
    title: "Competition Team Coach",
    gym: "10th Planet",
    city: "Los Angeles, CA",
    type: "Full-time",
    belt: "No-Gi specialist",
    pay: "$5,200/mo",
    postedAt: "1 day ago",
    isNew: true,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-lg font-medium">
          <Shield className="w-5 h-5 text-brand-400" style={{ color: "#1D9E75" }} />
          BJJJobs
          <span className="text-xs bg-brand-400 text-white px-2 py-0.5 rounded-full ml-1" style={{ background: "#1D9E75" }}>
            BETA
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/jobs" className="text-sm text-gray-500 hover:text-gray-900">Browse jobs</Link>
          <Link href="/post-job" className="text-sm text-gray-500 hover:text-gray-900">For gyms</Link>
          <Link href="/register/coach" className="text-sm text-gray-500 hover:text-gray-900">For coaches</Link>
          <Link
            href="/post-job"
            className="text-sm font-medium text-white px-4 py-2 rounded-lg"
            style={{ background: "#1D9E75" }}
          >
            Post a job
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-8 py-20">
        <div
          className="inline-block text-xs font-medium px-4 py-1.5 rounded-full mb-5"
          style={{ background: "#E1F5EE", color: "#0F6E56" }}
        >
          The #1 job board for BJJ coaches
        </div>
        <h1 className="text-5xl font-medium text-gray-900 leading-tight mb-4 max-w-xl mx-auto">
          Find your next <span style={{ color: "#1D9E75" }}>coaching role</span> on the mat
        </h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto mb-10">
          Connect with gyms across the country. Whether you&apos;re a purple belt or a black belt, your next opportunity is here.
        </p>

        {/* Search bar */}
        <div className="flex items-center gap-3 max-w-xl mx-auto border border-gray-200 rounded-xl px-4 py-2 mb-6 bg-white shadow-sm">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Job title, skill, or affiliation..."
            className="flex-1 text-sm outline-none bg-transparent"
          />
          <div className="w-px h-5 bg-gray-200" />
          <select className="text-sm text-gray-500 outline-none bg-transparent pr-2">
            <option>All cities</option>
            <option>Miami, FL</option>
            <option>Dallas, TX</option>
            <option>Los Angeles, CA</option>
            <option>New York, NY</option>
          </select>
          <Link
            href="/jobs"
            className="text-sm font-medium text-white px-4 py-2 rounded-lg flex-shrink-0"
            style={{ background: "#1D9E75" }}
          >
            Search
          </Link>
        </div>

        {/* CTA cards */}
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/register/coach"
            className="flex items-center gap-3 border border-gray-200 rounded-xl px-6 py-3 hover:border-green-400 transition-colors"
          >
            <Users className="w-5 h-5" style={{ color: "#1D9E75" }} />
            <div className="text-left">
              <div className="text-sm font-medium">I&apos;m a coach</div>
              <div className="text-xs text-gray-500">Find coaching roles</div>
            </div>
          </Link>
          <Link
            href="/register/gym"
            className="flex items-center gap-3 border border-gray-200 rounded-xl px-6 py-3 hover:border-green-400 transition-colors"
          >
            <Building2 className="w-5 h-5" style={{ color: "#1D9E75" }} />
            <div className="text-left">
              <div className="text-sm font-medium">I&apos;m a gym</div>
              <div className="text-xs text-gray-500">Post open positions</div>
            </div>
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-16 py-6 border-y border-gray-100 bg-gray-50">
        {[
          { num: "340+", label: "Open positions" },
          { num: "180+", label: "Gyms hiring" },
          { num: "1,200+", label: "Coaches registered" },
          { num: "42", label: "States covered" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl font-medium">{s.num}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Featured jobs */}
      <section className="px-8 py-14 max-w-3xl mx-auto">
        <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#1D9E75" }}>
          Latest openings
        </div>
        <h2 className="text-2xl font-medium mb-1">Featured jobs</h2>
        <p className="text-sm text-gray-500 mb-8">Hand-picked listings from top gyms this week</p>

        <div className="flex flex-col gap-3">
          {FEATURED_JOBS.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 hover:border-green-300 transition-colors group"
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "#E1F5EE" }}
              >
                🥋
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900">{job.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {job.gym} · {job.city}
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                    style={{ background: "#E1F5EE", color: "#0F6E56" }}
                  >
                    {job.type}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {job.belt}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                {job.isNew && (
                  <div
                    className="text-xs font-medium text-white px-2 py-0.5 rounded-full mb-1 inline-block"
                    style={{ background: "#1D9E75" }}
                  >
                    New
                  </div>
                )}
                <div className="text-sm font-medium">{job.pay}</div>
                <div className="text-xs text-gray-400 mt-0.5">{job.postedAt}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: "#1D9E75" }}
          >
            View all jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 py-14 bg-gray-50">
        <div className="text-center mb-10">
          <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#1D9E75" }}>
            How it works
          </div>
          <h2 className="text-2xl font-medium">Simple. Fast. Built for BJJ.</h2>
        </div>
        <div className="grid grid-cols-3 gap-5 max-w-3xl mx-auto">
          {[
            { icon: Users, step: "01", title: "Create your profile", desc: "Add your belt rank, affiliation, competition history, and teaching experience in minutes." },
            { icon: Search, step: "02", title: "Browse & filter", desc: "Search by city, pay range, schedule type, or affiliation. Find the right fit, not just any job." },
            { icon: CheckCircle, step: "03", title: "Apply in one click", desc: "Your profile is your application. Gyms can contact you directly or you apply to their listing." },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-xl p-6 border border-gray-100">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: "#E1F5EE" }}
              >
                <item.icon className="w-5 h-5" style={{ color: "#1D9E75" }} />
              </div>
              <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#1D9E75" }}>
                Step {item.step}
              </div>
              <div className="font-medium text-sm mb-2">{item.title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-8 py-10">
        <div className="rounded-2xl p-10 text-center max-w-2xl mx-auto" style={{ background: "#0F6E56" }}>
          <h2 className="text-2xl font-medium text-white mb-2">Ready to post your first job?</h2>
          <p className="text-sm mb-6" style={{ color: "#9FE1CB" }}>
            Join 180+ gyms already finding great coaches on BJJJobs
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/post-job"
              className="text-sm font-medium bg-white px-6 py-2.5 rounded-lg"
              style={{ color: "#0F6E56" }}
            >
              Post a job — it&apos;s free
            </Link>
            <Link
              href="/register/coach"
              className="text-sm font-medium px-6 py-2.5 rounded-lg border text-white"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              I&apos;m a coach
            </Link>
          </div>
        </div>
      </section>

      <footer className="flex items-center justify-between px-8 py-5 border-t border-gray-100">
        <div className="text-sm text-gray-400">BJJJobs.com · 2025</div>
        <div className="flex gap-5 text-xs text-gray-400">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
