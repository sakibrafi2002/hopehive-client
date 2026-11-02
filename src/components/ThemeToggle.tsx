"use client";

import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";
import { THEME_KEY, THEMES } from "@/lib/constants";

type Mode = "light" | "dark";

/** Switches the whole app (navbar, cards, forms, footer, dialogs) between the light and dark theme. */
export function ThemeToggle() {
  const [mode, setMode] = useState<Mode | null>(null);

  // The inline script in layout.tsx has already applied the saved theme; read it back instead of guessing.
  useEffect(() => {
    setMode(document.documentElement.getAttribute("data-theme") === THEMES.dark ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Mode = mode === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", THEMES[next]);
    try {
      localStorage.setItem(THEME_KEY, THEMES[next]);
    } catch {
      // Private mode can block storage. The theme still changes for this visit.
    }
    setMode(next);
  }

  const label = mode === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      disabled={mode === null}
      className="btn btn-ghost btn-circle h-11 w-11 text-xl"
    >
      {mode === "dark" ? <LuSun aria-hidden="true" /> : <LuMoon aria-hidden="true" />}
    </button>
  );
}
