import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

/** Label + control + inline error, spaced the same way in every form. */
export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-base-content">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : (
        hint && <p className="text-sm text-base-content/60">{hint}</p>
      )}
    </div>
  );
}

export const inputClass = (error?: string) => `input w-full ${error ? "input-error" : ""}`;
export const selectClass = (error?: string) => `select w-full ${error ? "select-error" : ""}`;
export const textareaClass = (error?: string) => `textarea w-full min-h-36 ${error ? "textarea-error" : ""}`;
