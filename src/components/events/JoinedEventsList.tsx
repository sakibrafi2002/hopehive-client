"use client";

import { LuClipboardList } from "react-icons/lu";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { joinedToCardEvent, type JoinedEventItem } from "@/lib/types";
import { useApiData } from "@/lib/useApiData";
import { EventCard } from "./EventCard";
import { EventGrid, EventGridSkeleton } from "./EventGrid";

/** Events the logged-in user joined. The API returns them sorted by event date, nearest first. */
export function JoinedEventsList() {
  const { data, error, reload } = useApiData<JoinedEventItem[]>("/api/joined-events", {
    auth: true,
    fallbackError: "We could not load your joined events",
  });

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (data === null) return <EventGridSkeleton count={3} />;

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<LuClipboardList />}
        title="You have not joined any events yet"
        text="When you join a drive, it shows up here so you can keep track of where and when to show up."
        actionHref="/events"
        actionLabel="Browse Upcoming Events"
      />
    );
  }

  return (
    <>
      <p className="mb-5 text-sm text-base-content/70" aria-live="polite">
        {data.length === 1 ? "You have joined 1 event" : `You have joined ${data.length} events`}
      </p>
      <EventGrid>
        {data.map((item) => (
          <EventCard key={item._id} event={joinedToCardEvent(item)} />
        ))}
      </EventGrid>
    </>
  );
}
