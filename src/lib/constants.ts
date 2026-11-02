export const SITE = {
  name: "HopeHive",
  tagline: "Show up. Serve together.",
  description:
    "HopeHive connects neighbours who want to help. Create social service events, join the ones near you and keep track of the good you do.",
};

export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Blood Donation",
  "Education",
  "Health Camp",
  "Flood Relief",
  "Food Distribution",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const THEME_KEY = "hopehive-theme";
export const THEMES = { light: "hopehive-light", dark: "hopehive-dark" } as const;

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(/\/+$/, "");
