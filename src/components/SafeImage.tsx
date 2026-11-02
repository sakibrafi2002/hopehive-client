"use client";

import { useEffect, useRef, useState } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

/**
 * Event thumbnails are URLs typed in by users, so some will be broken. This swaps in a branded placeholder
 * instead of a broken-image icon. The effect also catches images that failed before React attached onError.
 */
export function SafeImage({ src, alt, className = "", loading = "lazy" }: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={failed || !src ? PLACEHOLDER_IMAGE : src}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
