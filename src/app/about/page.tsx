import Link from "next/link";
import {
  Shield,
  Users,
  Building2,
  Target,
  Heart,
  ArrowRight,
  Search,
  MessageCircle,
} from "lucide-react";
import PublicNav from "@/components/public-nav";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="px-8 py-20 text-center border-b border-gray-100 bg-gray-50">
        <div
          className="inline-block text-xs font-medium px-4 py-1.5 rounded-full mb-5"
          style={{ background: "#E1F5EE", color: "#0F6E56" }}
        >
          About BJJJobs
        </div>
        <h1 className="text-4xl font-medium text-gray-900 leading-tight mb-4 max-w-2xl mx-auto">
          Built for the mat. Designed to connect coaches and gyms.
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
          BJJJobs exists for one reason: to make hiring and job hunting in Brazilian
          jiu-jitsu simple, transparent, and professional — so great coaches find great
          gyms, and great gyms find great coaches.
        </p>
      </section>

      {/* Mission */}
      <section className="px-8 py-16 max-w-3xl mx-auto">
        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#E1F5EE" }}
          >
            <Target className="w-5 h-5" style={{ color: "#1D9E75" }} />
          </div>
          <div>
            <h2 className="text-xl font-medium mb-3">Our mission</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Brazilian jiu-jitsu has grown into a global industry — but the way coaches
              and gyms find each other hasn&apos;t kept up. Too often, hiring still happens
              through Instagram DMs, Facebook groups, and word of mouth. That works until
              it doesn&apos;t: messages get lost, qualifications are unclear, and both sides
              waste weeks going back and forth with no structure.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              BJJJobs brings that process onto one platform built specifically for the
              sport. We understand belt ranks, affiliations, gi vs. no-gi, competition
              backgrounds, and what gyms actually need from a coach. Our goal is to remove
              friction from every step — from the first search to the final hire.
            </p>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="px-8 py-14 bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-medium text-center mb-10">Why we built this</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="text-xs font-medium uppercase tracking-wider mb-3 text-gray-400">
                The old way
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  "Coaches scroll through social media hoping to spot an opening",
                  "Gyms post in group chats and hope the right person sees it",
                  "No clear way to compare experience, belt rank, or pay expectations",
                  "Applications disappear into DMs with no tracking or follow-up",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-gray-300 mt-0.5">×</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div
                className="text-xs font-medium uppercase tracking-wider mb-3"
                style={{ color: "#1D9E75" }}
              >
                The BJJJobs way
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  "Coaches browse structured listings filtered by city, belt, and style",
                  "Gyms post jobs once and reach qualified coaches actively looking",
                  "Profiles showcase rank, specialties, and teaching background",
                  "Applications are tracked from first click to final decision",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "#1D9E75" }} className="mt-0.5">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* For coaches / gyms */}
      <section className="px-8 py-16 max-w-3xl mx-auto">
        <h2 className="text-xl font-medium text-center mb-10">Who we serve</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="border border-gray-100 rounded-2xl p-7">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "#E1F5EE" }}
            >
              <Users className="w-5 h-5" style={{ color: "#1D9E75" }} />
            </div>
            <h3 className="font-medium mb-2">For coaches</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              You&apos;ve put years on the mat. Your teaching experience, belt rank, and
              competition record deserve a home where gyms can actually find you. Build a
              profile once, search listings that match your goals, and apply with a single
              click — no more cold messaging gym owners and hoping for a reply.
            </p>
            <Link
              href="/register?role=coach"
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "#1D9E75" }}
            >
              Create a coach profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="border border-gray-100 rounded-2xl p-7">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "#E1F5EE" }}
            >
              <Building2 className="w-5 h-5" style={{ color: "#1D9E75" }} />
            </div>
            <h3 className="font-medium mb-2">For gyms</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Finding the right coach is one of the most important decisions a gym makes.
              BJJJobs gives you a public profile, a place to post open positions, and a
              dashboard to review applicants — belt rank, specialties, and cover message
              included. Hire faster, with less guesswork.
            </p>
            <Link
              href="/register?role=gym"
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "#1D9E75" }}
            >
              Create a gym profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-8 py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-medium text-center mb-10">What we believe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Search,
                title: "Clarity over noise",
                desc: "Every listing should answer the questions that matter: belt requirement, pay, schedule, and what the role actually involves.",
              },
              {
                icon: Heart,
                title: "Built by people who train",
                desc: "This isn't a generic job board with a BJJ label. The platform is shaped around how the community actually hires and gets hired.",
              },
              {
                icon: MessageCircle,
                title: "Respect for both sides",
                desc: "Coaches deserve to know where they stand. Gyms deserve qualified applicants. We built tools that serve both.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-gray-100 rounded-xl p-5">
                <item.icon className="w-5 h-5 mb-3" style={{ color: "#1D9E75" }} />
                <div className="font-medium text-sm mb-2">{item.title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-16 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-6 h-6" style={{ color: "#1D9E75" }} />
          <span className="text-lg font-medium">BJJJobs</span>
        </div>
        <h2 className="text-2xl font-medium mb-3">Ready to get started?</h2>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Whether you&apos;re looking for your next coaching role or your gym&apos;s next
          great instructor, it starts here.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/jobs"
            className="text-sm font-medium px-6 py-2.5 rounded-lg border border-gray-200 hover:border-green-400 transition-colors"
          >
            Browse open jobs
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-white px-6 py-2.5 rounded-lg"
            style={{ background: "#1D9E75" }}
          >
            Create an account
          </Link>
        </div>
      </section>

      <footer className="flex items-center justify-between px-8 py-5 border-t border-gray-100">
        <div className="text-sm text-gray-400">BJJJobs.com · 2025</div>
        <div className="flex gap-5 text-xs text-gray-400">
          <Link href="/about" className="hover:text-gray-600">
            About
          </Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
