"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { LuMail, LuSend } from "react-icons/lu";
import { Container } from "@/components/ui/Container";
import { newsletterSchema, validateWith } from "@/lib/validation";

/** Design only: the form validates the address and confirms, but nothing is sent or stored. */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateWith(newsletterSchema, { email });
    if (found.email) {
      setError(found.email);
      toast.error(found.email);
      return;
    }
    setError(undefined);
    setEmail("");
    toast.success("Thank you for subscribing! Watch your inbox for the next drive");
  }

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-box bg-primary px-6 py-12 text-primary-content sm:px-12 sm:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary/30 blur-2xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-base-100/15 blur-2xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-content/15 text-2xl">
              <LuMail aria-hidden="true" />
            </span>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">Hear about the next drive first</h2>
            <p className="mt-3 text-base text-primary-content/85 sm:text-lg">
              One short email a week with new events near you and stories from the volunteers who made them happen.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
              <div className="flex-1 text-left">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError(undefined);
                  }}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(error)}
                  className={`input input-lg w-full bg-base-100 text-base-content ${error ? "input-error" : ""}`}
                />
                {error && (
                  <p role="alert" className="mt-1.5 text-sm text-primary-content">
                    {error}
                  </p>
                )}
              </div>
              <button type="submit" className="btn btn-secondary btn-lg">
                <LuSend aria-hidden="true" /> Subscribe
              </button>
            </form>

            <p className="mt-4 text-sm text-primary-content/70">No spam. Unsubscribe whenever you like.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
