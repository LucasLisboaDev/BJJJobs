import { Briefcase, FileText, Download } from "lucide-react";
import { formatExperienceDates } from "@/lib/coach-experience";

export function CoachExperienceSection({
  coach,
  compact = false,
}: {
  coach: {
    resumeUrl?: string | null;
    resumeFileName?: string | null;
    experiences?: Array<{
      id: string;
      position: string;
      organization: string;
      description: string;
      reasonLeft?: string | null;
      startDate: string;
      endDate?: string | null;
    }>;
  };
  compact?: boolean;
}) {
  const experiences = coach.experiences ?? [];
  const hasResume = !!coach.resumeUrl;
  const hasExperiences = experiences.length > 0;

  if (!hasResume && !hasExperiences) return null;

  return (
    <div className={compact ? "space-y-3" : "ios-card p-6 mb-4"}>
      {!compact && (
        <h2 className="text-headline mb-4 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-brand" />
          Teaching experience
        </h2>
      )}

      {hasResume && (
        <a
          href={coach.resumeUrl!}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 rounded-xl ios-card tap ${
            compact ? "p-3" : "p-4 mb-4"
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-brand" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {coach.resumeFileName ?? "Resume.pdf"}
            </div>
            <div className="text-footnote text-label-secondary">PDF resume</div>
          </div>
          <Download className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </a>
      )}

      {hasExperiences && (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className={`rounded-xl ios-card ${compact ? "p-3" : "p-4"}`}
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <div className="text-sm font-medium">{exp.position}</div>
                  <div className="text-xs text-gray-500">{exp.organization}</div>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">
                  {formatExperienceDates(exp.startDate, exp.endDate)}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">{exp.description}</p>
              {exp.reasonLeft && (
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-medium text-gray-600">Why they left: </span>
                  {exp.reasonLeft}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
