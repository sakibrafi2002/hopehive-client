"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Field, inputClass, selectClass, textareaClass } from "@/components/ui/Field";
import { SafeImage } from "@/components/SafeImage";
import { ApiError, apiFetch, errorMessage } from "@/lib/api";
import { EVENT_TYPES } from "@/lib/constants";
import { tomorrowString } from "@/lib/dates";
import { emptyEventForm, validateEventForm, type EventFormValues, type FieldErrors } from "@/lib/validation";

interface EventFormProps {
  mode: "create" | "edit";
  eventId?: string;
  initial?: EventFormValues;
}

type Errors = FieldErrors<keyof EventFormValues>;

const isHttpUrl = (value: string) => /^https?:\/\/\S+\.\S+/i.test(value.trim());

/** Create Event and Update Event share this form, so both enforce exactly the same rules. */
export function EventForm({ mode, eventId, initial }: EventFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<EventFormValues>(initial ?? emptyEventForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [minDate, setMinDate] = useState<string>("");

  // Past dates cannot be picked. Computed after mount so server and browser markup always match.
  useEffect(() => {
    const tomorrow = tomorrowString();
    const original = initial?.eventDate;
    setMinDate(original && original < tomorrow ? original : tomorrow);
  }, [initial?.eventDate]);

  function update(name: keyof EventFormValues) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setValues((current) => ({ ...current, [name]: value }));
      if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateEventForm(values, initial?.eventDate);
    setErrors(found);
    const firstProblem = Object.values(found).find(Boolean);
    if (firstProblem) {
      toast.error(firstProblem);
      return;
    }

    const body = {
      title: values.title.trim(),
      description: values.description.trim(),
      eventType: values.eventType,
      thumbnail: values.thumbnail.trim(),
      location: values.location.trim(),
      eventDate: values.eventDate,
    };

    setSubmitting(true);
    try {
      if (mode === "create") {
        await apiFetch("/api/events", { method: "POST", body, auth: true });
        toast.success("Event created! Volunteers can find it now");
        router.push("/events");
      } else {
        await apiFetch(`/api/events/${eventId}`, { method: "PUT", body, auth: true });
        toast.success("Event updated successfully");
        router.push("/manage-events");
      }
    } catch (error) {
      if (error instanceof ApiError && error.fields) setErrors(error.fields as Errors);
      toast.error(errorMessage(error));
      setSubmitting(false);
    }
  }

  const showPreview = isHttpUrl(values.thumbnail);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
      <Field label="Event title" htmlFor="title" error={errors.title}>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={update("title")}
          placeholder="Winter Clothes Distribution"
          maxLength={100}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "title-error" : undefined}
          className={inputClass(errors.title)}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Event type" htmlFor="eventType" error={errors.eventType}>
          <select
            id="eventType"
            name="eventType"
            value={values.eventType}
            onChange={update("eventType")}
            aria-invalid={Boolean(errors.eventType)}
            className={selectClass(errors.eventType)}
          >
            <option value="" disabled>
              Choose a type
            </option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Event date"
          htmlFor="eventDate"
          error={errors.eventDate}
          hint={mode === "create" ? "Pick a day from tomorrow onwards" : undefined}
        >
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            value={values.eventDate}
            min={minDate || undefined}
            onChange={update("eventDate")}
            aria-invalid={Boolean(errors.eventDate)}
            className={inputClass(errors.eventDate)}
          />
        </Field>
      </div>

      <Field label="Location" htmlFor="location" error={errors.location} hint="Area and city, for example Mirpur 10, Dhaka">
        <input
          id="location"
          name="location"
          type="text"
          value={values.location}
          onChange={update("location")}
          placeholder="Mohammadpur, Dhaka"
          maxLength={120}
          aria-invalid={Boolean(errors.location)}
          className={inputClass(errors.location)}
        />
      </Field>

      <Field
        label="Thumbnail image URL"
        htmlFor="thumbnail"
        error={errors.thumbnail}
        hint="Paste a link to a photo that shows what the event is about"
      >
        <input
          id="thumbnail"
          name="thumbnail"
          type="url"
          inputMode="url"
          value={values.thumbnail}
          onChange={update("thumbnail")}
          placeholder="https://example.com/photo.jpg"
          aria-invalid={Boolean(errors.thumbnail)}
          className={inputClass(errors.thumbnail)}
        />
      </Field>

      {showPreview && (
        <div className="aspect-[16/6] w-full overflow-hidden rounded-field border border-base-300 bg-base-200">
          <SafeImage key={values.thumbnail} src={values.thumbnail.trim()} alt="Thumbnail preview" className="h-full w-full object-cover" />
        </div>
      )}

      <Field
        label="Description"
        htmlFor="description"
        error={errors.description}
        hint={`${values.description.trim().length}/2000 characters. Explain what volunteers will do and what to bring`}
      >
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={update("description")}
          placeholder="Tell volunteers where to meet, what the day looks like and what they should bring."
          maxLength={2000}
          aria-invalid={Boolean(errors.description)}
          className={textareaClass(errors.description)}
        />
      </Field>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => router.back()} disabled={submitting} className="btn btn-ghost">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="btn btn-primary sm:min-w-44">
          {submitting ? (
            <>
              <span className="loading loading-spinner loading-sm" /> Saving...
            </>
          ) : mode === "create" ? (
            "Create Event"
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}
