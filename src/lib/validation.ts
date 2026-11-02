import { z } from "zod";
import { EVENT_TYPES } from "./constants";
import { todayString } from "./dates";

export type FieldErrors<T extends string = string> = Partial<Record<T, string>>;

/** Collapses zod issues into { field: "first message" } so each input can show its own error. */
export function collectErrors<T extends string>(error: z.ZodError): FieldErrors<T> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "form";
    if (!(key in fields)) fields[key] = issue.message;
  }
  return fields as FieldErrors<T>;
}

const httpUrl = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .url(`Enter a valid ${label.toLowerCase()}`)
    .refine((value) => /^https?:\/\//i.test(value), `${label} must start with http:// or https://`);

const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address, like name@example.com");

// ---------- Passwords ----------

export const PASSWORD_RULES = [
  { id: "length", label: "At least 6 characters", test: (value: string) => value.length >= 6 },
  { id: "upper", label: "One uppercase letter (A-Z)", test: (value: string) => /[A-Z]/.test(value) },
  { id: "lower", label: "One lowercase letter (a-z)", test: (value: string) => /[a-z]/.test(value) },
] as const;

const PASSWORD_MESSAGES: Record<(typeof PASSWORD_RULES)[number]["id"], string> = {
  length: "Password must be at least 6 characters long",
  upper: "Password must include an uppercase letter",
  lower: "Password must include a lowercase letter",
};

export function firstPasswordProblem(password: string): string | null {
  const broken = PASSWORD_RULES.find((rule) => !rule.test(password));
  return broken ? PASSWORD_MESSAGES[broken.id] : null;
}

const registerPassword = z.string().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({ code: "custom", message: "Password is required" });
    return;
  }
  const problem = firstPasswordProblem(value);
  if (problem) ctx.addIssue({ code: "custom", message: problem });
});

// ---------- Auth forms ----------

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name can be at most 60 characters"),
  email,
  photoURL: httpUrl("Photo URL"),
  password: registerPassword,
});

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name can be at most 60 characters"),
  photoURL: httpUrl("Photo URL"),
});

export const newsletterSchema = z.object({ email });

// ---------- Events ----------

export interface EventFormValues {
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
}

export const emptyEventForm: EventFormValues = {
  title: "",
  description: "",
  eventType: "",
  thumbnail: "",
  location: "",
  eventDate: "",
};

/**
 * Validates the Create and Update event forms.
 * `originalDate` is passed when editing: keeping the date as it was is allowed, moving it needs a future date.
 */
export function validateEventForm(values: EventFormValues, originalDate?: string): FieldErrors<keyof EventFormValues> {
  const schema = z.object({
    title: z
      .string()
      .trim()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title can be at most 100 characters"),
    description: z
      .string()
      .trim()
      .min(30, "Description must be at least 30 characters so volunteers know what to expect")
      .max(2000, "Description can be at most 2000 characters"),
    eventType: z
      .string()
      .min(1, "Choose an event type")
      .refine((value) => (EVENT_TYPES as readonly string[]).includes(value), "Choose one of the available event types"),
    thumbnail: httpUrl("Thumbnail image URL"),
    location: z
      .string()
      .trim()
      .min(3, "Location must be at least 3 characters")
      .max(120, "Location can be at most 120 characters"),
    eventDate: z
      .string()
      .min(1, "Pick the event date")
      .refine((value) => {
        if (originalDate && value === originalDate) return true;
        return value > todayString();
      }, "Event date must be in the future"),
  });

  const result = schema.safeParse(values);
  return result.success ? {} : collectErrors<keyof EventFormValues>(result.error);
}

export function validateWith<T extends z.ZodTypeAny>(schema: T, values: unknown): FieldErrors {
  const result = schema.safeParse(values);
  return result.success ? {} : collectErrors(result.error);
}
