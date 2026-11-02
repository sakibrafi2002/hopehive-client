import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { safeRedirect } from "@/lib/redirect";

/**
 * Every page in this group is private. The session is checked on the server before anything renders:
 * a logged-in user who reloads stays on the page, anyone else is sent to Login and returned here afterwards.
 */
export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders }).catch(() => null);

  if (!session) {
    const target = safeRedirect(requestHeaders.get("x-pathname"), "/");
    redirect(`/login?redirect=${encodeURIComponent(target)}`);
  }

  return <>{children}</>;
}
