import type { ReactNode } from "react";
import { Container } from "./Container";

interface SectionProps {
  children: ReactNode;
  id?: string;
  tone?: "base" | "alt";
  className?: string;
}

/** Equal vertical rhythm for every home page section. "alt" tints the background to separate neighbours. */
export function Section({ children, id, tone = "base", className = "" }: SectionProps) {
  return (
    <section id={id} className={`py-16 sm:py-20 ${tone === "alt" ? "bg-base-200" : "bg-base-100"} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
