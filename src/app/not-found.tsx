import Link from "next/link";
import { LuCompass } from "react-icons/lu";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl text-primary">
        <LuCompass aria-hidden="true" />
      </span>
      <h1 className="text-4xl font-semibold">We could not find that page</h1>
      <p className="mt-3 max-w-md text-base-content/70">
        The link may be old, or the event may have been removed by its organizer. Let us get you back on track.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          Go to Home
        </Link>
        <Link href="/events" className="btn btn-outline">
          Browse Upcoming Events
        </Link>
      </div>
    </Container>
  );
}
