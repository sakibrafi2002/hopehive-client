import Link from "next/link";
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { LuArrowRight, LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import { EVENT_TYPES, SITE } from "@/lib/constants";
import { Logo } from "./Logo";
import { Container } from "./ui/Container";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Upcoming Events" },
  { href: "/create-event", label: "Create Event" },
  { href: "/manage-events", label: "Manage Events" },
  { href: "/joined-events", label: "Joined Events" },
];

const SOCIALS = [
  { href: "https://x.com/sakibrafi2001", label: "HopeHive on X", icon: FaXTwitter },
  { href: "https://facebook.com/sakibrafi2001", label: "HopeHive on Facebook", icon: FaFacebookF },
  { href: "https://instagram.com/sakibrafi2001", label: "HopeHive on Instagram", icon: FaInstagram },
  { href: "https://linkedin.com/sakibrafi2002", label: "HopeHive on LinkedIn", icon: FaLinkedinIn },
  { href: "https://youtube.com/sakibrafi2001", label: "HopeHive on YouTube", icon: FaYoutube },
  { href: "https://github.com/sakibrafi2002", label: "HopeHive on GitHub", icon: FaGithub },
];

export function Footer() {
  return (
    <footer className="relative mt-16 bg-neutral text-neutral-content">
      {/* Soft wave that blends the page background into the footer */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-10 w-full -translate-y-[99%] text-neutral sm:h-16"
      >
        <path fill="currentColor" d="M0 80V40C240 0 480 0 720 28s480 36 720 4v48H0Z" />
      </svg>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-secondary to-accent" />

      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo onDark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-content/75">
              {SITE.tagline} HopeHive brings neighbours together for winter clothes drives, blanket distributions, cleanups,
              plantations and more across Dhaka.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {SOCIALS.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-content/10 text-base text-neutral-content transition hover:bg-secondary hover:text-secondary-content"
                  >
                    <Icon aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-neutral-content">Quick links</h3>
            <ul className="space-y-2.5 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex items-center gap-2 text-neutral-content/75 transition hover:text-secondary">
                    <LuArrowRight aria-hidden="true" className="transition group-hover:translate-x-0.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-neutral-content">Ways to help</h3>
            <ul className="grid grid-cols-1 gap-2.5 text-sm">
              {EVENT_TYPES.slice(0, 6).map((type) => (
                <li key={type}>
                  <Link
                    href={`/events?type=${encodeURIComponent(type)}`}
                    className="text-neutral-content/75 transition hover:text-secondary"
                  >
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-neutral-content">Say hello</h3>
            <ul className="space-y-3 text-sm text-neutral-content/75">
              <li className="flex gap-3">
                <LuMapPin aria-hidden="true" className="mt-0.5 shrink-0 text-lg text-secondary" />
                <span>Mirpur 10, Dhaka 1216, Bangladesh</span>
              </li>
              <li className="flex gap-3">
                <LuPhone aria-hidden="true" className="mt-0.5 shrink-0 text-lg text-secondary" />
                <a href="tel:+8801626648842" className="hover:text-secondary">
                  +880 1626-648842
                </a>
              </li>
              <li className="flex gap-3">
                <LuMail aria-hidden="true" className="mt-0.5 shrink-0 text-lg text-secondary" />
                <a href="mailto:sakibrafi2001@gmail.com" className="hover:text-secondary">
                  sakibrafi2001@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-neutral-content/15 pt-6 text-sm text-neutral-content/60 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. Made with care in Dhaka.
          </p>
          <p>Every drive starts with someone deciding to show up.</p>
        </div>
      </Container>
    </footer>
  );
}
