import type { ReactNode } from "react";

/** Single page width and gutter used by every section, so alignment stays identical across the site. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}
