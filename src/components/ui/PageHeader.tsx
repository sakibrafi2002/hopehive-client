import type { ReactNode } from "react";
import { Container } from "./Container";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

/** Banner at the top of every inner page (Upcoming Events, Create Event, Manage Events...). */
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="border-b border-base-300 bg-linear-to-br from-primary/10 via-base-100 to-secondary/10">
      <Container className="flex flex-col gap-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:py-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold leading-tight text-base-content sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-base text-base-content/70 sm:text-lg">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </Container>
    </div>
  );
}
