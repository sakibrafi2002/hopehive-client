import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { auth } from "@/lib/auth";
import { safeRedirect } from "@/lib/redirect";

export const metadata: Metadata = { title: "Create your account" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const params = await searchParams;
  const redirectTo = safeRedirect(params.redirect);

  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (session) redirect(redirectTo);

  return (
    <AuthShell title="Join HopeHive" subtitle="Create your free account and start showing up for your neighbourhood.">
      <RegisterForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
