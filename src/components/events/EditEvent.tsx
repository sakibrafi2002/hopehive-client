"use client";

import Link from "next/link";
import { LuLock } from "react-icons/lu";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { authClient } from "@/lib/auth-client";
import type { EventItem } from "@/lib/types";
import { useApiData } from "@/lib/useApiData";
import { EventForm } from "./EventForm";

function FormSkeleton() {
  return (
    <div role="status" aria-label="Loading event" className="space-y-6 rounded-box border border-base-300 bg-base-100 p-6 sm:p-8">
      <div className="skeleton h-12 w-full" />
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-12 w-full" />
      </div>
      <div className="skeleton h-12 w-full" />
      <div className="skeleton h-12 w-full" />
      <div className="skeleton h-36 w-full" />
      <div className="skeleton ml-auto h-12 w-44" />
    </div>
  );
}

/** Loads one event and shows the update form, but only to the person who created it. */
export function EditEvent({ eventId }: { eventId: string }) {
  const { data: session, isPending } = authClient.useSession();
  const {
    data: event,
    error,
    reload,
  } = useApiData<EventItem>(`/api/events/${encodeURIComponent(eventId)}`, {
    fallbackError: "We could not load this event",
  });

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!event || isPending) return <FormSkeleton />;

  const isOwner = session?.user.email.toLowerCase() === event.creatorEmail.toLowerCase();
  if (!isOwner) {
    return (
      <div>
        <EmptyState
          icon={<LuLock />}
          title="This is not your event"
          text="You can only update events that you created. Take a look at the ones you manage instead."
          actionHref="/manage-events"
          actionLabel="Back to Manage Events"
        />
        <p className="mt-4 text-center text-sm text-base-content/60">
          Or{" "}
          <Link href={`/events/${event._id}`} className="link link-primary">
            view this event
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <EventForm
      mode="edit"
      eventId={event._id}
      initial={{
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        thumbnail: event.thumbnail,
        location: event.location,
        eventDate: event.eventDate,
      }}
    />
  );
}
