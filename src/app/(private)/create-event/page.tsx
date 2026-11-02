import type { Metadata } from "next";
import { EventForm } from "@/components/events/EventForm";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Create Event",
  description: "Organize a social service event and invite your neighbours to join.",
};

export default function CreateEventPage() {
  return (
    <>
      <PageHeader
        title="Create an Event"
        subtitle="Tell volunteers what is happening, where to show up and when. You can edit or remove it later from Manage Events."
      />
      <Container className="max-w-3xl py-10 sm:py-12">
        <EventForm mode="create" />
      </Container>
    </>
  );
}
