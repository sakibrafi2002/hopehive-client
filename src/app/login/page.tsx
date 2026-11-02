import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { auth } from "@/lib/auth";
import { safeRedirect } from "@/lib/redirect";

export const metadata: Metadata = { title: "Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; expired?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = safeRedirect(params.redirect);

  // Someone who is already logged in has no reason to see the form.
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (session) redirect(redirectTo);

  return (
    <AuthShell title="Welcome back" subtitle="Log in to create events, join drives and track what you have signed up for.">
      <LoginForm redirectTo={redirectTo} expired={params.expired === "1"} />
    </AuthShell>
  );
}
