"use client";

import { ErrorState } from "@/components/ui/ErrorState";
import { Container } from "@/components/ui/Container";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-16">
      <ErrorState message="Something unexpected happened on our side. Trying again usually fixes it." onRetry={reset} />
    </Container>
  );
}
