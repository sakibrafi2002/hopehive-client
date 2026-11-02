"use client";

import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

/** Global toast host, plus the welcome toast shown after returning from Google sign-in. */
export function Providers() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("auth") !== "google") return;

    toast.success("Welcome to HopeHive! You are signed in with Google", { id: "google-welcome" });
    url.searchParams.delete("auth");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--color-base-100)",
          color: "var(--color-base-content)",
          border: "1px solid var(--color-base-300)",
          borderRadius: "var(--radius-field)",
          boxShadow: "0 10px 30px -12px rgb(0 0 0 / 0.35)",
          fontSize: "0.925rem",
          maxWidth: "26rem",
        },
        success: { iconTheme: { primary: "var(--color-success)", secondary: "var(--color-success-content)" } },
        error: { iconTheme: { primary: "var(--color-error)", secondary: "var(--color-error-content)" } },
      }}
    />
  );
}
