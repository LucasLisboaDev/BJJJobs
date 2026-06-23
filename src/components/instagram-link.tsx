import { Instagram, ExternalLink } from "lucide-react";
import { instagramProfileUrl } from "@/lib/instagram";

export function InstagramLink({
  handle,
  className = "",
}: {
  handle: string;
  className?: string;
}) {
  const url = instagramProfileUrl(handle);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 hover:underline tap ${className}`}
    >
      <Instagram className="w-3.5 h-3.5 shrink-0" />
      @{handle}
      <ExternalLink className="w-3 h-3 opacity-60" />
    </a>
  );
}
