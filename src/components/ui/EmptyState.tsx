import Link from "next/link";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  text: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({ icon, title, text, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
        {icon}
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-base-content/70">{text}</p>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
