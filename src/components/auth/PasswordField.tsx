"use client";

import { useState } from "react";
import { LuCheck, LuEye, LuEyeOff, LuX } from "react-icons/lu";
import { Field } from "@/components/ui/Field";
import { PASSWORD_RULES } from "@/lib/validation";

interface PasswordFieldProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: "current-password" | "new-password";
  /** Show the live checklist of password rules (Register page). */
  showRules?: boolean;
}

export function PasswordField({
  id = "password",
  label = "Password",
  value,
  onChange,
  error,
  autoComplete,
  showRules = false,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Field label={label} htmlFor={id} error={error}>
        <div className="relative">
          <input
            id={id}
            name={id}
            type={visible ? "text" : "password"}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            autoComplete={autoComplete}
            placeholder="Enter your password"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`input w-full pr-12 ${error ? "input-error" : ""}`}
          />
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="btn btn-ghost btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2 text-lg"
          >
            {visible ? <LuEyeOff aria-hidden="true" /> : <LuEye aria-hidden="true" />}
          </button>
        </div>
      </Field>

      {showRules && (
        <ul className="mt-3 space-y-1.5 text-sm" aria-label="Password requirements">
          {PASSWORD_RULES.map((rule) => {
            const passed = rule.test(value);
            return (
              <li key={rule.id} className={`flex items-center gap-2 ${passed ? "text-success" : "text-base-content/60"}`}>
                {passed ? <LuCheck aria-hidden="true" /> : <LuX aria-hidden="true" />}
                {rule.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
