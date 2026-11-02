"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuCircleCheck, LuHeartHandshake } from "react-icons/lu";
import { ApiError, apiFetch, errorMessage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { isPast } from "@/lib/dates";

interface JoinButtonProps {
  eventId: string;
  eventDate: string;
}

/**
 * Anyone can read an event, but joining needs an account. Logged-out visitors are sent to Login with a
 * reason, and come back to this same event afterwards.
 */
export function JoinButton({ eventId, eventDate }: JoinButtonProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [joined, setJoined] = useState(false);
  const [checking, setChecking] = useState(false);
  const [joining, setJoining] = useState(false);

  const userEmail = session?.user.email;
  const closed = isPast(eventDate);

  useEffect(() => {
    if (!userEmail) {
      setJoined(false);
      return;
    }
    let cancelled = false;
    setChecking(true);
    apiFetch<{ joined: boolean }>(`/api/events/${eventId}/join-status`, { auth: true })
      .then((result) => {
        if (!cancelled) setJoined(result.joined);
      })
      .catch(() => {
        // The join button still works; the server rejects duplicates anyway.
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [eventId, userEmail]);

  async function handleJoin() {
    if (!session) {
      toast.error("Please log in to join this event");
      router.push(`/login?redirect=${encodeURIComponent(`/events/${eventId}`)}`);
      return;
    }

    setJoining(true);
    try {
      const result = await apiFetch<{ message: string }>(`/api/events/${eventId}/join`, { method: "POST", auth: true });
      setJoined(true);
      toast.success(result.message);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setJoined(true);
      }
      toast.error(errorMessage(error));
    } finally {
      setJoining(false);
    }
  }

  if (closed) {
    return (
      <button type="button" className="btn btn-block" disabled>
        Event Completed
      </button>
    );
  }

  if (joined) {
    return (
      <button type="button" className="btn btn-success btn-block" disabled>
        <LuCircleCheck aria-hidden="true" /> Already Joined
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleJoin}
      disabled={joining || isPending || checking}
      className="btn btn-primary btn-block"
    >
      {joining ? (
        <>
          <span className="loading loading-spinner loading-sm" /> Joining...
        </>
      ) : (
        <>
          <LuHeartHandshake aria-hidden="true" /> Join Event
        </>
      )}
    </button>
  );
}
