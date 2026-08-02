"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type FormFieldProps = {
  label: string;
  name: string;
  type?: "text" | "tel" | "password";
  placeholder: string;
  icon: LucideIcon;
  autoComplete?: string;
};

export default function FormField({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  autoComplete,
}: FormFieldProps) {
  const isPassword = type === "password";
  // Only relevant for password fields — toggles the native input type.
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="mb-5 block text-right">
      <span className="mb-2 block text-sm font-medium text-text-secondary">{label}</span>
      <span className="relative block">
        <input
          name={name}
          type={isPassword ? (isVisible ? "text" : "password") : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border border-border bg-surface-soft py-3 pr-11 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-strong focus:outline-none ${
            isPassword ? "pl-11" : "pl-4"
          }`}
        />

        {/* Decorative field icon on the trailing edge (right, in RTL) */}
        <Icon
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary"
          aria-hidden
        />

        {/* Show/hide toggle on the leading edge (left, in RTL) — password only */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label={isVisible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors hover:text-text-secondary"
          >
            {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        )}
      </span>
    </label>
  );
}