"use client";

import { useState, type FormEvent } from "react";
import { Lock, User } from "lucide-react";
import Link from "next/link";
import FormField from "./FormField";
import AuthSubmitButton from "./AuthSubmitButton";
import { loginUser } from "@/lib/auth";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      await loginUser({
        username: String(formData.get("username") ?? ""),
        password: String(formData.get("password") ?? ""),
        remember: formData.get("remember") === "on",
      });
      // TODO: redirect to the dashboard once login succeeds, e.g.
      // router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ورود ناموفق بود.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="mt-2" onSubmit={handleSubmit}>
      <FormField
        label="نام کاربری"
        name="username"
        placeholder="نام کاربری خود را وارد کنید"
        icon={User}
        autoComplete="username"
      />

      <FormField
        label="رمز عبور"
        name="password"
        type="password"
        placeholder="رمز عبور خود را وارد کنید"
        icon={Lock}
        autoComplete="current-password"
      />

      <div className="mb-6 flex items-center justify-between text-xs">
        <label className="flex items-center gap-1.5 text-text-secondary">
          <input type="checkbox" name="remember" className="h-4 w-4 rounded border-border accent-accent" />
          مرا به خاطر بسپار
        </label>
        <Link href="/forgot-password" className="text-accent-light hover:text-accent">
          رمز عبور را فراموش کرده‌اید؟
        </Link>
      </div>

      {error && <p className="mb-4 text-center text-xs text-red-400">{error}</p>}

      <AuthSubmitButton label="ورود به حساب" isLoading={isLoading} />
    </form>
  );
}