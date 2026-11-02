"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Field, inputClass } from "@/components/ui/Field";
import { authClient } from "@/lib/auth-client";
import { friendlyAuthError } from "@/lib/auth-errors";
import { loginSchema, validateWith, type FieldErrors } from "@/lib/validation";
import { GoogleButton } from "./GoogleButton";
import { PasswordField } from "./PasswordField";

interface LoginFormProps {
  redirectTo: string;
  expired: boolean;
}

export function LoginForm({ redirectTo, expired }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors<"email" | "password">>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (expired) toast.error("Your session has ended. Please log in again", { id: "session-expired" });
  }, [expired]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateWith(loginSchema, { email, password }) as FieldErrors<"email" | "password">;
    setErrors(found);
    const firstProblem = found.email ?? found.password;
    if (firstProblem) {
      toast.error(firstProblem);
      return;
    }

    setSubmitting(true);
    const { data, error } = await authClient.signIn.email({ email: email.trim(), password });

    if (error || !data) {
      toast.error(friendlyAuthError(error, "We could not log you in. Please try again"));
      setSubmitting(false);
      return;
    }

    toast.success(`Welcome back, ${data.user.name}!`);
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
            }}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            className={inputClass(errors.email)}
          />
        </Field>

        <PasswordField
          value={password}
          onChange={(value) => {
            setPassword(value);
            if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
          }}
          error={errors.password}
          autoComplete="current-password"
        />

        <button type="submit" disabled={submitting} className="btn btn-primary btn-block">
          {submitting ? (
            <>
              <span className="loading loading-spinner loading-sm" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="divider text-sm text-base-content/50">or</div>

      <GoogleButton redirectTo={redirectTo} />

      <p className="text-center text-sm text-base-content/70">
        New to HopeHive?{" "}
        <Link
          href={redirectTo === "/" ? "/register" : `/register?redirect=${encodeURIComponent(redirectTo)}`}
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
