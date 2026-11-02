"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LuCalendarPlus, LuClipboardList, LuHeartHandshake, LuLayoutDashboard, LuLogOut, LuUser } from "react-icons/lu";
import { Avatar } from "./Avatar";
import type { NavbarUser } from "./Navbar";

interface UserMenuProps {
  user: NavbarUser;
  onLogout: () => void;
  loggingOut: boolean;
}

const MENU_ITEMS = [
  { href: "/create-event", label: "Create Event", icon: LuCalendarPlus },
  { href: "/manage-events", label: "Manage Events", icon: LuLayoutDashboard },
  { href: "/joined-events", label: "Joined Events", icon: LuClipboardList },
  { href: "/profile", label: "My Profile", icon: LuUser },
] as const;

/**
 * Profile picture with the account dropdown. Hovering the picture shows the user's display name,
 * clicking it opens Create Event, Manage Events and Joined Events. The Logout button sits next to it.
 */
export function UserMenu({ user, onLogout, loggingOut }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      {/* The name tooltip is hidden while the menu is open so the two never overlap. */}
      <div className={open ? "" : "tooltip tooltip-bottom"} data-tip={user.name}>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`Account menu for ${user.name}`}
          className="btn btn-ghost btn-circle h-11 w-11 p-0"
        >
          <Avatar name={user.name} src={user.image} className="h-9 w-9" />
        </button>
      </div>

      <button
        type="button"
        onClick={onLogout}
        disabled={loggingOut}
        className="btn btn-outline btn-primary hidden sm:inline-flex"
      >
        {loggingOut ? <span className="loading loading-spinner loading-sm" /> : <LuLogOut aria-hidden="true" />}
        Logout
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
        >
          <div className="flex items-center gap-3 border-b border-base-300 px-3 pb-3 pt-2">
            <Avatar name={user.name} src={user.image} className="h-10 w-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-base-content/60">{user.email}</p>
            </div>
          </div>

          <ul className="py-2">
            {MENU_ITEMS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  role="menuitem"
                  className={`flex items-center gap-3 rounded-field px-3 py-2.5 text-sm font-medium hover:bg-base-200 ${
                    pathname === href ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  <Icon aria-hidden="true" className="text-lg" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-base-300 pt-2 sm:hidden">
            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-field px-3 py-2.5 text-sm font-medium text-error hover:bg-error/10"
            >
              <LuLogOut aria-hidden="true" className="text-lg" />
              Logout
            </button>
          </div>

          <p className="hidden items-center gap-1.5 px-3 pb-1 pt-2 text-xs text-base-content/50 sm:flex">
            <LuHeartHandshake aria-hidden="true" /> Thanks for showing up
          </p>
        </div>
      )}
    </div>
  );
}
