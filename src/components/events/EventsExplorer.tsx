"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LuCalendarDays, LuSearch, LuSlidersHorizontal, LuX } from "react-icons/lu";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { apiFetch, errorMessage } from "@/lib/api";
import { EVENT_TYPES } from "@/lib/constants";
import { toCardEvent, type EventItem } from "@/lib/types";
import { EventCard } from "./EventCard";
import { EventGrid, EventGridSkeleton } from "./EventGrid";

type SortValue = "soonest" | "latest";

/**
 * Upcoming Events with the extra feature: search by title or location, filter by event type and sort by date.
 * Filters live in the URL, so a filtered view survives a reload and can be shared as a link.
 */
export function EventsExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") ?? "";
  const urlType = searchParams.get("type") ?? "";
  const urlSort: SortValue = searchParams.get("sort") === "latest" ? "latest" : "soonest";

  const [searchText, setSearchText] = useState(urlSearch);
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Typing waits a moment before it touches the URL, so the list is not refetched on every keystroke.
  useEffect(() => {
    if (searchText.trim() === urlSearch.trim()) return;
    const timer = setTimeout(() => setParam("search", searchText.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchText, urlSearch, setParam]);

  // Keep the box in step when the URL changes from outside (back button, footer link, Clear filters).
  useEffect(() => {
    setSearchText(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const controller = new AbortController();
    setEvents(null);
    setLoadError(null);

    const query = new URLSearchParams();
    if (urlSearch.trim()) query.set("search", urlSearch.trim());
    if (urlType) query.set("type", urlType);
    query.set("sort", urlSort);

    apiFetch<EventItem[]>(`/api/events?${query.toString()}`, { signal: controller.signal })
      .then(setEvents)
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(errorMessage(error, "We could not load the events"));
      });

    return () => controller.abort();
  }, [urlSearch, urlType, urlSort, attempt]);

  const hasFilters = Boolean(urlSearch || urlType || urlSort !== "soonest");

  function clearFilters() {
    setSearchText("");
    router.replace(pathname, { scroll: false });
  }

  return (
    <div>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          setParam("search", searchText.trim());
        }}
        className="mb-8 grid gap-3 rounded-box border border-base-300 bg-base-100 p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[1fr_14rem_12rem_auto]"
      >
        <label className="input w-full sm:col-span-2 lg:col-span-1">
          <LuSearch aria-hidden="true" className="text-base-content/50" />
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by title or location"
            aria-label="Search events by title or location"
          />
        </label>

        <select
          value={urlType}
          onChange={(event) => setParam("type", event.target.value)}
          aria-label="Filter by event type"
          className="select w-full"
        >
          <option value="">All event types</option>
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={urlSort}
          onChange={(event) => setParam("sort", event.target.value === "latest" ? "latest" : "")}
          aria-label="Sort events by date"
          className="select w-full"
        >
          <option value="soonest">Soonest first</option>
          <option value="latest">Furthest first</option>
        </select>

        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasFilters}
          className="btn btn-ghost sm:col-span-2 lg:col-span-1"
        >
          <LuX aria-hidden="true" /> Clear
        </button>
      </form>

      {events && (
        <p className="mb-5 flex items-center gap-2 text-sm text-base-content/70" aria-live="polite">
          <LuSlidersHorizontal aria-hidden="true" />
          {events.length === 1 ? "1 upcoming event" : `${events.length} upcoming events`}
          {hasFilters ? " match your filters" : ""}
        </p>
      )}

      {loadError ? (
        <ErrorState message={loadError} onRetry={() => setAttempt((value) => value + 1)} />
      ) : events === null ? (
        <EventGridSkeleton count={6} />
      ) : events.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={<LuSearch />}
            title="No events match your search"
            text="Try a different word, another area or another event type."
          />
        ) : (
          <EmptyState
            icon={<LuCalendarDays />}
            title="No upcoming events yet"
            text="Nothing is scheduled right now. Start something for your neighbourhood."
            actionHref="/create-event"
            actionLabel="Create an Event"
          />
        )
      ) : (
        <EventGrid>
          {events.map((event) => (
            <EventCard key={event._id} event={toCardEvent(event)} />
          ))}
        </EventGrid>
      )}
    </div>
  );
}
