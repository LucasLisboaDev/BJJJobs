import Link from "next/link";
import { Shield } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 tap ${className}`}>
      <div className="w-[30px] h-[30px] rounded-[9px] bg-brand flex items-center justify-center flex-shrink-0">
        <Shield className="w-[18px] h-[18px] text-white" strokeWidth={2.1} />
      </div>
      <span className="font-display font-bold text-lg tracking-tight text-label">
        BJJ<span className="text-brand">Jobs</span>
      </span>
    </Link>
  );
}
