import type { ReactNode } from "react";

/** Same grid everywhere: 1 column on phones, 2 on tablets, 3 on desktops, with equal gaps. */
export function EventGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function EventCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100">
      <div className="skeleton aspect-[16/10] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="skeleton h-5 w-11/12" />
        <div className="skeleton h-5 w-2/3" />
        <div className="mt-1 space-y-2.5">
          <div className="skeleton h-4 w-3/5" />
          <div className="skeleton h-4 w-2/5" />
          <div className="skeleton h-4 w-1/2" />
        </div>
        <div className="skeleton mt-auto h-12 w-full" />
      </div>
    </div>
  );
}

export function EventGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading events">
      <EventGrid>
        {Array.from({ length: count }, (_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </EventGrid>
    </div>
  );
}
