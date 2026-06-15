import Link from "next/link";
import { Shield, Briefcase, Users, Bell } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2 text-base font-medium">
          <Shield className="w-5 h-5" style={{ color: "#1D9E75" }} />
          BJJJobs
        </Link>
        <div className="flex items-center gap-4">
          <button className="relative">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
          </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium" style={{ background: "#E1F5EE", color: "#0F6E56" }}>
            LL
          </div>
        </div>
      </nav>

      <div className="px-8 py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-1">Welcome back, Lucas</h1>
          <p className="text-sm text-gray-500">Here&apos;s what&apos;s happening with your profile</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Briefcase, label: "Applications sent", value: "7" },
            { icon: Users, label: "Profile views", value: "34" },
            { icon: Bell, label: "New matches", value: "3" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-5">
              <stat.icon className="w-5 h-5 mb-3" style={{ color: "#1D9E75" }} />
              <div className="text-2xl font-medium">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="font-medium mb-4">Recommended jobs for you</h2>
          <div className="text-sm text-gray-500">
            Complete your profile to see personalized job matches.{" "}
            <Link href="/register/coach" className="font-medium" style={{ color: "#1D9E75" }}>
              Finish setup →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
