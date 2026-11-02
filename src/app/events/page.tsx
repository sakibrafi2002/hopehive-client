import type { Metadata } from "next";
import { Suspense } from "react";
import { EventsExplorer } from "@/components/events/EventsExplorer";
import { EventGridSkeleton } from "@/components/events/EventGrid";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description: "Browse social service events happening near you and join the ones you care about.",
};

export default function EventsPage() {
  return (
    <>
      <PageHeader
        title="Upcoming Events"
        subtitle="Every drive, cleanup and camp that is still ahead of us. Events that have passed are not shown here."
      />
      <Container className="py-10 sm:py-12">
        {/* useSearchParams needs a Suspense boundary so the page can still be prerendered. */}
        <Suspense fallback={<EventGridSkeleton count={6} />}>
          <EventsExplorer />
        </Suspense>
      </Container>
    </>
  );
}
