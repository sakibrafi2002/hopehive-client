"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Field, inputClass } from "@/components/ui/Field";
import { authClient } from "@/lib/auth-client";
import { friendlyAuthError } from "@/lib/auth-errors";
import { registerSchema, validateWith, type FieldErrors } from "@/lib/validation";
import { GoogleButton } from "./GoogleButton";
import { PasswordField } from "./PasswordField";

type Name = "name" | "email" | "photoURL" | "password";

export function RegisterForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", photoURL: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors<Name>>({});
  const [submitting, setSubmitting] = useState(false);

  function change(name: Name, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateWith(registerSchema, values) as FieldErrors<Name>;
    setErrors(found);
    const firstProblem = found.name ?? found.email ?? found.photoURL ?? found.password;
    if (firstProblem) {
      toast.error(firstProblem);
      return;
    }

    setSubmitting(true);
    const { data, error } = await authClient.signUp.email({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      image: values.photoURL.trim(),
    });

    if (error || !data) {
      toast.error(friendlyAuthError(error, "We could not create your account. Please try again"));
      setSubmitting(false);
      return;
    }

    toast.success(`Account created! Welcome to HopeHive, ${values.name.trim()}`);
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field label="Full name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(event) => change("name", event.target.value)}
            placeholder="Your full name"
            aria-invalid={Boolean(errors.name)}
            className={inputClass(errors.name)}
          />
        </Field>

        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => change("email", event.target.value)}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            className={inputClass(errors.email)}
          />
        </Field>

        <Field
          label="Photo URL"
          htmlFor="photoURL"
          error={errors.photoURL}
          hint="A link to your profile picture. It appears in the navbar"
        >
          <input
            id="photoURL"
            name="photoURL"
            type="url"
            inputMode="url"
            value={values.photoURL}
            onChange={(event) => change("photoURL", event.target.value)}
            placeholder="https://example.com/me.jpg"
            aria-invalid={Boolean(errors.photoURL)}
            className={inputClass(errors.photoURL)}
          />
        </Field>

        <PasswordField
          value={values.password}
          onChange={(value) => change("password", value)}
          error={errors.password}
          autoComplete="new-password"
          showRules
        />

        <button type="submit" disabled={submitting} className="btn btn-primary btn-block">
          {submitting ? (
            <>
              <span className="loading loading-spinner loading-sm" /> Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="divider text-sm text-base-content/50">or</div>

      <GoogleButton redirectTo={redirectTo} />

      <p className="text-center text-sm text-base-content/70">
        Already have an account?{" "}
        <Link
          href={redirectTo === "/" ? "/login" : `/login?redirect=${encodeURIComponent(redirectTo)}`}
          className="font-semibold text-primary hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
