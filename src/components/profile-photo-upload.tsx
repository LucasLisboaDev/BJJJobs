"use client";
import { useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { ProfileAvatar } from "@/components/profile-avatar";

type UploadKind = "photo" | "logo";

const CONFIG: Record<
  UploadKind,
  { endpoint: string; field: string; urlKey: "photoUrl" | "logoUrl"; rounded: "full" | "lg" }
> = {
  photo: {
    endpoint: "/api/coach/photo",
    field: "photo",
    urlKey: "photoUrl",
    rounded: "full",
  },
  logo: {
    endpoint: "/api/gym/logo",
    field: "logo",
    urlKey: "logoUrl",
    rounded: "lg",
  },
};

export function ProfilePhotoUpload({
  kind,
  value,
  onChange,
  fallback,
  alt,
  label = "Profile photo",
  hint = "JPG, PNG, or WebP · max 2 MB · optional",
  disabled = false,
}: {
  kind: UploadKind;
  value?: string | null;
  onChange: (url: string | null) => void;
  fallback: React.ReactNode;
  alt: string;
  label?: string;
  hint?: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const cfg = CONFIG[kind];

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append(cfg.field, file);
      const res = await fetch(cfg.endpoint, { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        onChange(data[cfg.urlKey]);
      } else {
        setError(data.error || "Failed to upload image");
      }
    } catch {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {label ? <label className="field-label">{label}</label> : null}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <ProfileAvatar
            src={value}
            alt={alt}
            fallback={fallback}
            size="lg"
            rounded={cfg.rounded}
          />
          {uploading && (
            <div className="absolute inset-0 rounded-ios-lg bg-black/40 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={disabled || uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
              className="btn-secondary text-sm !py-2 !px-3 flex items-center gap-1.5 disabled:opacity-60"
            >
              <Camera className="w-3.5 h-3.5" />
              {value ? "Change photo" : "Upload photo"}
            </button>
            {value && (
              <button
                type="button"
                disabled={disabled || uploading}
                onClick={() => onChange(null)}
                className="btn-secondary text-sm !py-2 !px-3 flex items-center gap-1.5 text-label-secondary disabled:opacity-60"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            )}
          </div>
          <p className="text-caption-1 text-label-tertiary mt-1.5">{hint}</p>
          {error && <p className="text-caption-1 text-red-600 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
