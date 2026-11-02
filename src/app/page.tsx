import { Suspense } from "react";
import { EventGridSkeleton } from "@/components/events/EventGrid";
import { Features } from "@/components/home/Features";
import { Gallery } from "@/components/home/Gallery";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />

      <Section>
        <SectionHeading
          eyebrow="Coming up"
          title="Recent upcoming events"
          subtitle="The next drives on the calendar. Pick one close to home and show up."
        />
        <Suspense fallback={<EventGridSkeleton count={6} />}>
          <UpcomingEvents />
        </Suspense>
      </Section>

      <Gallery />
      <Newsletter />
    </>
  );
}
