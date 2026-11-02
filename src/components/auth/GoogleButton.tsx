"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import { friendlyAuthError } from "@/lib/auth-errors";
import { withParam } from "@/lib/redirect";

export function GoogleButton({ redirectTo }: { redirectTo: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    // On success the browser leaves for Google, so the page only gets control back if something went wrong.
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: withParam(redirectTo, "auth", "google"),
    });
    if (error) {
      toast.error(friendlyAuthError(error, "We could not start Google sign-in. Please try again"));
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={loading} className="btn btn-outline btn-block">
      {loading ? <span className="loading loading-spinner loading-sm" /> : <FaGoogle aria-hidden="true" />}
      Continue with Google
    </button>
  );
}
