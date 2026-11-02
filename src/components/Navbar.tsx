"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { clearTokenCache } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Container } from "./ui/Container";
import { UserMenu } from "./UserMenu";

export interface NavbarUser {
  name: string;
  email: string;
  image: string | null;
}

export function Navbar({ initialUser }: { initialUser: NavbarUser | null }) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // While the browser session loads, trust what the server already knew. This is why a reload on a private
  // page never flashes the Login button for someone who is logged in.
  const user: NavbarUser | null = isPending
    ? initialUser
    : session
      ? { name: session.user.name, email: session.user.email, image: session.user.image ?? null }
      : null;

  async function handleLogout() {
    setLoggingOut(true);
    clearTokenCache();
    const { error } = await authClient.signOut();
    setLoggingOut(false);

    if (error) {
      toast.error("We could not log you out. Please try again");
      return;
    }
    toast.success("You have been logged out. See you soon!");
    router.push("/");
    router.refresh();
  }

  const eventsActive = pathname === "/events" || pathname.startsWith("/events/");

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <Container className="flex h-[4.5rem] items-center justify-between gap-2">
        <Logo />

        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/events"
            aria-current={eventsActive ? "page" : undefined}
            className={`btn btn-ghost px-3 text-sm sm:text-base ${eventsActive ? "text-primary" : ""}`}
          >
            <span className="hidden sm:inline">Upcoming Events</span>
            <span className="sm:hidden">Events</span>
          </Link>

          <ThemeToggle />

          {user ? (
            <UserMenu user={user} onLogout={handleLogout} loggingOut={loggingOut} />
          ) : (
            <Link href="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </nav>
      </Container>
    </header>
  );
}
