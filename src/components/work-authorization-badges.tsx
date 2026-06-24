"use client";
import { useLanguage } from "@/components/language-provider";

export function WorkAuthorizationBadge({
  status,
  className = "",
}: {
  status: string;
  className?: string;
}) {
  const { t } = useLanguage();
  const label = t(`workAuth.status.${status}` as any);
  if (!label || label.startsWith("workAuth.")) return null;

  return (
    <span className={`chip text-brand ${className}`}>
      {label}
    </span>
  );
}

export function JobWorkAuthBadges({
  workPermitRequired,
  sponsorshipAvailable,
  className = "",
}: {
  workPermitRequired: boolean;
  sponsorshipAvailable: boolean;
  className?: string;
}) {
  const { t } = useLanguage();

  if (!workPermitRequired && !sponsorshipAvailable) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {workPermitRequired && (
        <span className="chip chip-active !bg-amber-50 !text-amber-900">
          {t("workAuth.jobPermitRequired")}
        </span>
      )}
      {sponsorshipAvailable && (
        <span className="chip chip-active !bg-brand-light !text-brand-dark">
          {t("workAuth.jobSponsorshipAvailable")}
        </span>
      )}
    </div>
  );
}
