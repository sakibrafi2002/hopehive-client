"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Avatar } from "@/components/Avatar";
import { Field, inputClass } from "@/components/ui/Field";
import { authClient } from "@/lib/auth-client";
import { formatTimestamp } from "@/lib/dates";
import { profileSchema, validateWith, type FieldErrors } from "@/lib/validation";

type Errors = FieldErrors<"name" | "photoURL">;

function ProfileSkeleton() {
  return (
    <div role="status" aria-label="Loading profile" className="space-y-6 rounded-box border border-base-300 bg-base-100 p-6 sm:p-8">
      <div className="flex items-center gap-4">
        <div className="skeleton h-20 w-20 shrink-0 rounded-full" />
        <div className="w-full space-y-3">
          <div className="skeleton h-5 w-1/2" />
          <div className="skeleton h-4 w-2/3" />
        </div>
      </div>
      <div className="skeleton h-12 w-full" />
      <div className="skeleton h-12 w-full" />
      <div className="skeleton ml-auto h-12 w-40" />
    </div>
  );
}

/** Profile view and update: the user can change their display name and profile picture. */
export function ProfileForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  // Fill the form once, when the session first arrives. Later session refreshes must not overwrite typing.
  useEffect(() => {
    if (session && loadedFor !== session.user.id) {
      setName(session.user.name);
      setPhotoURL(session.user.image ?? "");
      setLoadedFor(session.user.id);
    }
  }, [session, loadedFor]);

  if (isPending || !session) return <ProfileSkeleton />;

  const user = session.user;
  const unchanged = name.trim() === user.name && photoURL.trim() === (user.image ?? "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateWith(profileSchema, { name, photoURL }) as Errors;
    setErrors(found);
    const firstProblem = Object.values(found).find(Boolean);
    if (firstProblem) {
      toast.error(firstProblem);
      return;
    }

    setSaving(true);
    const { error } = await authClient.updateUser({ name: name.trim(), image: photoURL.trim() });
    setSaving(false);

    if (error) {
      toast.error(error.message && error.message.length < 140 ? error.message : "We could not update your profile");
      return;
    }
    toast.success("Profile updated. Your new name and picture are live");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-4">
        <Avatar name={name || user.name} src={photoURL.trim() || user.image} className="h-20 w-20 text-2xl" />
        <div className="min-w-0">
          <p className="truncate text-xl font-semibold">{user.name}</p>
          <p className="truncate text-sm text-base-content/70">{user.email}</p>
          <p className="mt-1 text-xs text-base-content/55">Member since {formatTimestamp(String(user.createdAt))}</p>
        </div>
      </div>

      <Field label="Display name" htmlFor="name" error={errors.name}>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
          }}
          maxLength={60}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          className={inputClass(errors.name)}
        />
      </Field>

      <Field
        label="Profile picture URL"
        htmlFor="photoURL"
        error={errors.photoURL}
        hint="The preview above updates as you type"
      >
        <input
          id="photoURL"
          type="url"
          inputMode="url"
          value={photoURL}
          onChange={(event) => {
            setPhotoURL(event.target.value);
            if (errors.photoURL) setErrors((current) => ({ ...current, photoURL: undefined }));
          }}
          placeholder="https://example.com/me.jpg"
          aria-invalid={Boolean(errors.photoURL)}
          className={inputClass(errors.photoURL)}
        />
      </Field>

      <Field label="Email" htmlFor="email" hint="Your email is your login, so it cannot be changed here">
        <input id="email" type="email" value={user.email} readOnly disabled className="input w-full" />
      </Field>

      <div className="flex justify-end">
        <button type="submit" disabled={saving || unchanged} className="btn btn-primary sm:min-w-44">
          {saving ? (
            <>
              <span className="loading loading-spinner loading-sm" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}
