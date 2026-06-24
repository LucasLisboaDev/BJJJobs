"use client";

const SIZE_CLASSES = {
  sm: "w-10 h-10 text-sm",
  md: "w-14 h-14 text-lg",
  lg: "w-16 h-16 text-2xl",
};

export function ProfileAvatar({
  src,
  alt,
  fallback,
  size = "md",
  rounded = "lg",
  className = "",
}: {
  src?: string | null;
  alt: string;
  fallback: React.ReactNode;
  size?: keyof typeof SIZE_CLASSES;
  rounded?: "full" | "lg";
  className?: string;
}) {
  const shape = rounded === "full" ? "rounded-full" : "rounded-ios-lg";

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`${SIZE_CLASSES[size]} ${shape} object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${SIZE_CLASSES[size]} ${shape} flex items-center justify-center shrink-0 bg-brand-light font-semibold text-brand ${className}`}
    >
      {fallback}
    </div>
  );
}
