import Link from "next/link";
import type { ReactNode } from "react";
import { LuCalendarDays, LuMapPin, LuUsers } from "react-icons/lu";
import { SafeImage } from "@/components/SafeImage";
import { formatEventDate, isPast } from "@/lib/dates";
import type { CardEvent } from "@/lib/types";

interface EventCardProps {
  event: CardEvent;
  /** Replaces the default "View Event" button, for example with Update and Delete on Manage Events. */
  footer?: ReactNode;
}

/**
 * One card for every list in the app. Fixed image ratio, clamped text and a footer pinned to the bottom
 * keep every card in a grid exactly the same size, whatever the title or location length.
 */
export function EventCard({ event, footer }: EventCardProps) {
  const completed = isPast(event.eventDate);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-base-200">
        <SafeImage
          src={event.thumbnail}
          alt={`${event.title} thumbnail`}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
        <span className="badge badge-primary absolute left-3 top-3 border-0 font-medium shadow">{event.eventType}</span>
        {completed && (
          <span className="badge absolute right-3 top-3 border-0 bg-neutral font-medium text-neutral-content shadow">
            Completed
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-lg font-semibold leading-snug text-base-content">{event.title}</h3>

        <ul className="space-y-2 text-sm text-base-content/75">
          <li className="flex items-start gap-2">
            <LuMapPin aria-hidden="true" className="mt-0.5 shrink-0 text-base text-primary" />
            <span className="line-clamp-1">{event.location}</span>
          </li>
          <li className="flex items-center gap-2">
            <LuCalendarDays aria-hidden="true" className="shrink-0 text-base text-primary" />
            <span>{formatEventDate(event.eventDate)}</span>
          </li>
          {event.organizer && (
            <li className="flex items-center gap-2">
              <LuUsers aria-hidden="true" className="shrink-0 text-base text-primary" />
              <span className="line-clamp-1">
                By {event.organizer}
                {typeof event.participantCount === "number" && event.participantCount > 0
                  ? ` · ${event.participantCount} joined`
                  : ""}
              </span>
            </li>
          )}
        </ul>

        <div className="mt-auto pt-2">
          {footer ?? (
            <Link href={`/events/${event.id}`} className="btn btn-primary btn-block">
              View Event
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
