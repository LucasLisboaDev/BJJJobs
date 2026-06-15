"use client";
import { Shield } from "lucide-react";
import Link from "next/link";

const AFFILIATIONS = ["Alliance","Gracie Barra","Atos","10th Planet","Checkmat","Renzo Gracie","Independent","Other"];

export default function GymRegisterPage() {
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

        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Gym name</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400" placeholder="e.g. Alliance Miami" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">City</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400" placeholder="Miami" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">State</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400" placeholder="FL" />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Affiliation</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none">
              {AFFILIATIONS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Website <span className="font-normal text-gray-400">· optional</span></label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400" placeholder="https://yourgym.com" />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">About your gym <span className="font-normal text-gray-400">· optional</span></label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-400 resize-none"
              rows={3}
              placeholder="Tell coaches about your gym culture, schedule, and what makes you a great place to work..."
            />
          </div>

          <button className="w-full text-sm font-medium text-white py-2.5 rounded-lg" style={{ background: "#1D9E75" }}>
            Create gym profile →
          </button>
        </div>
      </div>
    </div>
  );
}
