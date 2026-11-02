"use client";

import { useEffect, useState } from "react";
import { initials } from "@/lib/placeholder";

interface AvatarProps {
  name: string;
  src?: string | null;
  className?: string;
}

/** Profile picture with an initials fallback for missing or broken photo URLs. */
export function Avatar({ name, src, className = "h-10 w-10" }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-content ${className}`}
      >
        {initials(name)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${name}'s profile picture`}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  );
}
