import type { Metadata } from "next";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "My Profile",
  description: "See your account details and update your name and profile picture.",
};

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="My Profile" subtitle="Your name and picture appear on your events and in the navigation bar." />
      <Container className="max-w-3xl py-10 sm:py-12">
        <ProfileForm />
      </Container>
    </>
  );
}
