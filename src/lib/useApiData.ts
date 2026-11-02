"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { apiFetch, errorMessage } from "./api";

interface ApiData<T> {
  data: T | null;
  error: string | null;
  /** Clears the data (so skeletons show again) and requests it once more. */
  reload: () => void;
  setData: Dispatch<SetStateAction<T | null>>;
}

/**
 * Loads one API resource for a page. `data === null && error === null` means "still loading",
 * which is when the page shows its skeleton.
 */
export function useApiData<T>(path: string, options: { auth?: boolean; fallbackError: string }): ApiData<T> {
  const { auth = false, fallbackError } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setData(null);
    setError(null);

    apiFetch<T>(path, { auth, signal: controller.signal })
      .then(setData)
      .catch((failure) => {
        if (failure instanceof DOMException && failure.name === "AbortError") return;
        setError(errorMessage(failure, fallbackError));
      });

    return () => controller.abort();
  }, [path, auth, fallbackError, attempt]);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  return { data, error, reload, setData };
}
