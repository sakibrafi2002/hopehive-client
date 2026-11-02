import Link from "next/link";
import { LuArrowRight, LuCalendarDays } from "react-icons/lu";
import { EventCard } from "@/components/events/EventCard";
import { EventGrid } from "@/components/events/EventGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { API_URL } from "@/lib/constants";
import { toCardEvent, type EventItem } from "@/lib/types";

async function loadRecentEvents(): Promise<EventItem[] | null> {
  try {
    // The API applies .limit(6) in MongoDB and only returns events that have not happened yet.
    const response = await fetch(`${API_URL}/api/events?limit=6`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as EventItem[];
  } catch {
    return null;
  }
}

/** Server component: the six soonest upcoming events, straight from the database. */
export async function UpcomingEvents() {
  const events = await loadRecentEvents();

  if (events === null) {
    return (
      <EmptyState
        icon={<LuCalendarDays />}
        title="Events are taking a moment"
        text="We could not reach the events service just now. Please refresh in a few seconds."
      />
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon={<LuCalendarDays />}
        title="No upcoming events yet"
        text="Be the first to organize something for your neighbourhood."
        actionHref="/create-event"
        actionLabel="Create an Event"
      />
    );
  }

  return (
    <>
      <EventGrid>
        {events.map((event) => (
          <EventCard key={event._id} event={toCardEvent(event)} />
        ))}
      </EventGrid>

      <div className="mt-10 flex justify-center">
        <Link href="/events" className="btn btn-primary">
          See All Upcoming Events <LuArrowRight aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}
