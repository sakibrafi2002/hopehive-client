"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { LuCalendarPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { apiFetch, errorMessage } from "@/lib/api";
import { confirmAction } from "@/lib/confirm";
import { toCardEvent, type EventItem } from "@/lib/types";
import { useApiData } from "@/lib/useApiData";
import { EventCard } from "./EventCard";
import { EventGrid, EventGridSkeleton } from "./EventGrid";

/** The logged-in user's own events, each with Update and Delete. The API refuses anyone else's. */
export function ManageEventsList() {
  const { data, setData, error, reload } = useApiData<EventItem[]>("/api/my-events", {
    auth: true,
    fallbackError: "We could not load your events",
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(event: EventItem) {
    const confirmed = await confirmAction({
      title: "Delete this event?",
      text: `"${event.title}" will be removed for good, and volunteers who joined will lose it from their list.`,
      confirmText: "Yes, delete it",
    });
    if (!confirmed) return;

    setDeletingId(event._id);
    try {
      await apiFetch(`/api/events/${event._id}`, { method: "DELETE", auth: true });
      setData((current) => (current ? current.filter((item) => item._id !== event._id) : current));
      toast.success("Event deleted");
    } catch (failure) {
      toast.error(errorMessage(failure, "We could not delete that event"));
    } finally {
      setDeletingId(null);
    }
  }

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (data === null) return <EventGridSkeleton count={3} />;

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<LuCalendarPlus />}
        title="You have not created any events"
        text="Start a clothes drive, a cleanup or a blood donation camp and it will appear here."
        actionHref="/create-event"
        actionLabel="Create an Event"
      />
    );
  }

  return (
    <>
      <p className="mb-5 text-sm text-base-content/70" aria-live="polite">
        {data.length === 1 ? "You have created 1 event" : `You have created ${data.length} events`}
      </p>
      <EventGrid>
        {data.map((event) => (
          <EventCard
            key={event._id}
            event={toCardEvent(event)}
            footer={
              <div className="grid grid-cols-2 gap-3">
                <Link href={`/manage-events/${event._id}/edit`} className="btn btn-primary">
                  <LuPencil aria-hidden="true" /> Update
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(event)}
                  disabled={deletingId === event._id}
                  className="btn btn-outline btn-error"
                >
                  {deletingId === event._id ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <LuTrash2 aria-hidden="true" />
                  )}
                  Delete
                </button>
              </div>
            }
          />
        ))}
      </EventGrid>
    </>
  );
}
