import type { Metadata } from "next";
import { JoinedEventsList } from "@/components/events/JoinedEventsList";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Joined Events",
  description: "Every social service event you have signed up for, sorted by date.",
};

export default function JoinedEventsPage() {
  return (
    <>
      <PageHeader
        title="Joined Events"
        subtitle="The drives you have signed up for, with the nearest date first. Past events stay here with a Completed badge."
      />
      <Container className="py-10 sm:py-12">
        <JoinedEventsList />
      </Container>
    </>
  );
}
