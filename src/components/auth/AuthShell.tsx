import type { ReactNode } from "react";
import { LuHeartHandshake, LuMapPin, LuSprout } from "react-icons/lu";
import { Container } from "@/components/ui/Container";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Shared frame for Login and Register: a warm story panel on desktop, just the form on phones. */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="bg-linear-to-br from-primary/10 via-base-100 to-secondary/15 py-10 sm:py-16">
      <Container className="grid items-stretch gap-8 lg:grid-cols-[1fr_1.05fr]">
        <aside className="relative hidden overflow-hidden rounded-box bg-neutral p-10 text-neutral-content lg:flex lg:flex-col lg:justify-between">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />

          <div className="relative">
            <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-3xl text-primary-content">
              <LuHeartHandshake aria-hidden="true" />
            </span>
            <h2 className="text-4xl font-semibold leading-tight text-neutral-content">
              One account. Every drive in your neighbourhood.
            </h2>
            <p className="mt-4 max-w-md text-lg text-neutral-content/75">
              Create events, join the ones that matter to you and keep a record of every blanket, sapling and smile you
              helped deliver.
            </p>
          </div>

          <ul className="relative mt-10 space-y-4 text-neutral-content/85">
            <li className="flex items-center gap-3">
              <LuMapPin aria-hidden="true" className="text-xl text-secondary" /> Winter drives in Mirpur, Mohammadpur and beyond
            </li>
            <li className="flex items-center gap-3">
              <LuSprout aria-hidden="true" className="text-xl text-secondary" /> Cleanups, plantations, blood camps and classes
            </li>
          </ul>
        </aside>

        <div className="mx-auto w-full max-w-xl rounded-box border border-base-300 bg-base-100 p-6 shadow-lg sm:p-10">
          <h1 className="text-3xl font-semibold leading-tight">{title}</h1>
          <p className="mt-2 text-base-content/70">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </Container>
    </div>
  );
}
