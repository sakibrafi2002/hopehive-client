// Event dates are plain YYYY-MM-DD strings and "today" is always Dhaka's today, so the server,
// the browser and the API agree on what counts as upcoming no matter where a visitor is.
const TIME_ZONE = "Asia/Dhaka";

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function todayString(): string {
  return dayFormatter.format(new Date());
}

export function addDays(base: string, days: number): string {
  const date = new Date(`${base}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function tomorrowString(): string {
  return addDays(todayString(), 1);
}

/** True once the event's day is over. */
export function isPast(eventDate: string): boolean {
  return eventDate < todayString();
}

export function formatEventDate(eventDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${eventDate}T00:00:00Z`));
}

export function formatLongDate(eventDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${eventDate}T00:00:00Z`));
}

export function formatTimestamp(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: TIME_ZONE }).format(
    new Date(iso),
  );
}
