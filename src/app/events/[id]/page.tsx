import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft, LuCalendarDays, LuMapPin, LuTag, LuUsers } from "react-icons/lu";
import { JoinButton } from "@/components/events/JoinButton";
import { SafeImage } from "@/components/SafeImage";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { API_URL } from "@/lib/constants";
import { formatLongDate, formatTimestamp, isPast } from "@/lib/dates";
import type { EventItem } from "@/lib/types";

type Loaded = { status: "ok"; event: EventItem } | { status: "missing" } | { status: "error" };

async function loadEvent(id: string): Promise<Loaded> {
  try {
    const response = await fetch(`${API_URL}/api/events/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (response.status === 404 || response.status === 400) return { status: "missing" };
    if (!response.ok) return { status: "error" };
    return { status: "ok", event: (await response.json()) as EventItem };
  } catch {
    return { status: "error" };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const result = await loadEvent(id);
  if (result.status !== "ok") return { title: "Event" };
  return { title: result.event.title, description: result.event.description.slice(0, 150) };
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await loadEvent(id);

  if (result.status === "missing") notFound();

  if (result.status === "error") {
    return (
      <Container className="py-16">
        <ErrorState message="The event service is not answering right now. Please refresh the page in a moment." />
      </Container>
    );
  }

  const { event } = result;
  const completed = isPast(event.eventDate);

  return (
    <Container className="py-8 sm:py-12">
      <Link href="/events" className="btn btn-ghost btn-sm mb-6 -ml-2">
        <LuArrowLeft aria-hidden="true" /> Back to Upcoming Events
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
        <article>
          <div className="aspect-[16/9] w-full overflow-hidden rounded-box border border-base-300 bg-base-200">
            <SafeImage src={event.thumbnail} alt={`${event.title} thumbnail`} loading="eager" className="h-full w-full object-cover" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="badge badge-primary badge-lg border-0">{event.eventType}</span>
            {completed && <span className="badge badge-neutral badge-lg border-0">Completed</span>}
          </div>

          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">{event.title}</h1>

          <h2 className="mt-8 text-xl font-semibold">About this event</h2>
          <p className="mt-3 max-w-prose whitespace-pre-line text-base leading-relaxed text-base-content/80">
            {event.description}
          </p>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Event details</h2>

            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <LuCalendarDays aria-hidden="true" className="mt-0.5 shrink-0 text-xl text-primary" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-base-content/70">{formatLongDate(event.eventDate)}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <LuMapPin aria-hidden="true" className="mt-0.5 shrink-0 text-xl text-primary" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-base-content/70">{event.location}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <LuTag aria-hidden="true" className="mt-0.5 shrink-0 text-xl text-primary" />
                <div>
                  <p className="font-medium">Event type</p>
                  <p className="text-base-content/70">{event.eventType}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <LuUsers aria-hidden="true" className="mt-0.5 shrink-0 text-xl text-primary" />
                <div>
                  <p className="font-medium">Organized by</p>
                  <p className="text-base-content/70">{event.creatorName}</p>
                  <p className="text-base-content/50">Posted {formatTimestamp(event.createdAt)}</p>
                </div>
              </li>
            </ul>

            <p className="mt-6 rounded-field bg-primary/10 px-4 py-3 text-sm text-base-content/80">
              <strong className="text-primary">{event.participantCount}</strong>{" "}
              {event.participantCount === 1 ? "volunteer has" : "volunteers have"} joined so far.
            </p>

            <div className="mt-6">
              <JoinButton eventId={event._id} eventDate={event.eventDate} />
            </div>
            <p className="mt-3 text-center text-xs text-base-content/55">You need to be logged in to join an event.</p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
