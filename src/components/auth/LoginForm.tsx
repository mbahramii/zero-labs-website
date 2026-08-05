"use client";

import { useState, type FormEvent } from "react";
import { Lock, User } from "lucide-react";
import Link from "next/link";
import FormField from "./FormField";
import AuthSubmitButton from "./AuthSubmitButton";
import { loginUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const remember = formData.get("remember") === "on";

    if (!username || !password) {
      setError("لطفاً همه فیلدها را تکمیل کنید.");
      return;
    }

    if (password.length < 8) {
      setError("رمز عبور حداقل ۸ کاراکتر باشد.");
      return;
    }

    setIsLoading(true);

    try {
  // const data = await loginUser({
  //   username,
  //   password,
  //   remember,
  // });

  const data = {
  token: "mock-jwt-token",
};
  // Store the authenticated user locally until the backend is connected.
  localStorage.setItem(
    "auth",
    JSON.stringify({
      token: data.token,
      user: {
        username,
      },
    })
  );

  // Redirect the user after a successful login.
  router.push("/");
} catch (err) {
  setError(err instanceof Error ? err.message : "ورود ناموفق بود.");
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