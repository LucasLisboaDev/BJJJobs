import Link from "next/link";
import { Shield, Search, Filter } from "lucide-react";

const JOBS = [
  { id:"1", title:"Head BJJ Coach", gym:"Alliance Jiu-Jitsu", city:"Miami, FL", type:"Full-time", belt:"Black belt preferred", styles:["Gi","No-Gi"], pay:"$4,500/mo", postedAt:"2 days ago", isNew:true },
  { id:"2", title:"Kids Program Instructor", gym:"Gracie Barra", city:"Austin, TX", type:"Part-time", belt:"Purple belt+", styles:["Gi","Kids"], pay:"$28/hr", postedAt:"4 days ago", isNew:false },
  { id:"3", title:"Competition Team Coach", gym:"10th Planet", city:"Los Angeles, CA", type:"Full-time", belt:"No-Gi specialist", styles:["No-Gi"], pay:"$5,200/mo", postedAt:"1 day ago", isNew:true },
  { id:"4", title:"Assistant Instructor", gym:"Marcelo Garcia Academy", city:"New York, NY", type:"Contract", belt:"Blue belt+", styles:["Gi","No-Gi"], pay:"$22/hr", postedAt:"1 week ago", isNew:false },
  { id:"5", title:"Women's BJJ Coach", gym:"Checkmat", city:"San Diego, CA", type:"Part-time", belt:"Purple belt+", styles:["Gi"], pay:"$30/hr", postedAt:"3 days ago", isNew:true },
];

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2 text-base font-medium">
          <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
          BJJJobs
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/post-job" className="text-sm font-medium text-white px-4 py-2 rounded-lg" style={{ background: "#1D9E75" }}>
            Post a job
          </Link>
        </div>
      </nav>

      <div className="px-8 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-medium mb-6">Browse coaching jobs</h1>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 bg-white border border-gray-100 rounded-xl p-3">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-gray-400" />
            <input className="text-sm outline-none flex-1" placeholder="Search jobs..." />
          </div>
          <div className="w-px h-5 bg-gray-200" />
          <select className="text-sm outline-none text-gray-500">
            <option>All cities</option>
            <option>Miami, FL</option>
            <option>Dallas, TX</option>
            <option>Los Angeles, CA</option>
          </select>
          <div className="w-px h-5 bg-gray-200" />
          <select className="text-sm outline-none text-gray-500">
            <option>All belt levels</option>
            <option>Blue belt+</option>
            <option>Purple belt+</option>
            <option>Black belt</option>
          </select>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {JOBS.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:border-green-300 transition-colors"
            >
              <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0" style={{ background: "#E1F5EE" }}>
                🥋
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{job.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{job.gym} · {job.city}</div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: "#E1F5EE", color: "#0F6E56" }}>{job.type}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{job.belt}</span>
                  {job.styles.map((s) => (
                    <span key={s} className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{s}</span>
                  ))}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                {job.isNew && (
                  <div className="text-xs font-medium text-white px-2 py-0.5 rounded-full mb-1 inline-block" style={{ background: "#1D9E75" }}>New</div>
                )}
                <div className="text-sm font-medium">{job.pay}</div>
                <div className="text-xs text-gray-400 mt-0.5">{job.postedAt}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
