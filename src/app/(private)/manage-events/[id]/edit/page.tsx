import type { Metadata } from "next";
import { EditEvent } from "@/components/events/EditEvent";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Update Event" };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <PageHeader
        title="Update Event"
        subtitle="Change anything you need. People who already joined will see the new details on their Joined Events page."
      />
      <Container className="max-w-3xl py-10 sm:py-12">
        <EditEvent eventId={id} />
      </Container>
    </>
  );
}
