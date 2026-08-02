"use client";

import { useState, type FormEvent } from "react";
import { Lock, Phone, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import FormField from "./FormField";
import AuthSubmitButton from "./AuthSubmitButton";
import { registerUser } from "@/lib/auth";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      await registerUser({
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        password: String(formData.get("password") ?? ""),
      });
      // TODO: redirect to the dashboard (or a verification step) once
      // registration succeeds, e.g. router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ثبت‌نام ناموفق بود.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="mt-2" onSubmit={handleSubmit}>
      <FormField label="نام" name="name" placeholder="نام خود را وارد کنید" icon={User} autoComplete="name" />

      <FormField
        label="شماره موبایل"
        name="phone"
        type="tel"
        placeholder="09xxxxxxxxx"
        icon={Phone}
        autoComplete="tel"
      />

      <FormField
        label="رمز عبور"
        name="password"
        type="password"
        placeholder="رمز عبور خود را وارد کنید"
        icon={Lock}
        autoComplete="new-password"
      />

      <p className="mb-6 flex items-center justify-end gap-1.5 text-right text-xs text-text-tertiary">
        رمز عبور باید حداقل ۸ کاراکتر و شامل عدد و حرف باشد.
        <ShieldCheck className="h-4 w-4 shrink-0 text-accent" />
      </p>

      {error && <p className="mb-4 text-center text-xs text-red-400">{error}</p>}

      <AuthSubmitButton label="ایجاد حساب" isLoading={isLoading} />

      <p className="mt-6 text-center text-sm text-text-secondary">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link href="/login" className="font-semibold text-accent-light hover:text-accent">
          ورود
        </Link>
      </p>
    </form>
  );
}