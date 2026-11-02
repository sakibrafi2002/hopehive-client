import type { Metadata } from "next";
import Link from "next/link";
import { LuCalendarPlus } from "react-icons/lu";
import { ManageEventsList } from "@/components/events/ManageEventsList";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Manage Events",
  description: "Update or delete the social service events you have created.",
};

export default function ManageEventsPage() {
  return (
    <>
      <PageHeader
        title="Manage Events"
        subtitle="Every event you created. Fix a detail, move the date or take an event down. Only you can change your events."
        action={
          <Link href="/create-event" className="btn btn-primary">
            <LuCalendarPlus aria-hidden="true" /> Create Event
          </Link>
        }
      />
      <Container className="py-10 sm:py-12">
        <ManageEventsList />
      </Container>
    </>
  );
}
