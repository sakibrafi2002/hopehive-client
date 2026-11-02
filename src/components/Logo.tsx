import Link from "next/link";
import { LuHeartHandshake } from "react-icons/lu";
import { SITE } from "@/lib/constants";

/** The same mark and wordmark in the navbar and the footer, always at the same size. */
export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE.name} home`}>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl text-primary-content">
        <LuHeartHandshake aria-hidden="true" />
      </span>
      <span className={`font-heading text-2xl font-semibold tracking-tight ${onDark ? "text-neutral-content" : "text-base-content"}`}>
        {SITE.name}
      </span>
    </Link>
  );
}
