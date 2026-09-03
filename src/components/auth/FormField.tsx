"use client";

import { useState, forwardRef, type InputHTMLAttributes } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: LucideIcon;
  error?: string;
};

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, icon: Icon, error, className = "", type, ...props }, ref) => {
    const isPassword = type === "password";
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="mb-5 block text-right">
        <label className="mb-2 block text-sm font-medium text-text-secondary">
          {label}
        </label>
        <span className="relative block">
          <input
            ref={ref} // Crucial for react-hook-form integration
            type={isPassword ? (isVisible ? "text" : "password") : type}
            className={`w-full rounded-xl border ${
              error 
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                : "border-border focus:border-border-strong focus:ring-2 focus:ring-accent/10"
            } bg-surface-soft py-3 pr-11 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none transition-all ${
              isPassword ? "pl-11" : "pl-4"
            } ${className}`}
            {...props} // All register props (name, onChange, onBlur, etc.) are applied here
          />

          {/* Decorative icon on the right side (optimized for RTL layout) */}
          {Icon && (
            <Icon
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary"
              aria-hidden
            />
          )}

          {/* Show/hide password toggle button on the left side */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setIsVisible((prev) => !prev)}
              aria-label={isVisible ? "Hide password" : "Show password"}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors hover:text-text-secondary"
            >
              {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          )}
        </span>
        
        {/* Display validation error message if it exists */}
        {error && (
          <p className="mt-1.5 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;