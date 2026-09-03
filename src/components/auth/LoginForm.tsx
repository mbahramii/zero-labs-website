"use client";

import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/schemas";
import { loginUser } from "@/lib/auth";
import { useAuth } from "@/components/context/AuthContext";
import FormField from "@/components/auth/FormField";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit(data: LoginFormData) {
    setError(null);

    try {
      const response = await loginUser({
        emailOrPhone: data.emailOrPhone,
        password: data.password,
        remember: data.remember ?? false,
      });

      // Save user session
      login({ email: data.emailOrPhone }, response.token);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    }
  }

  return (
    <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Email or Phone Number"
        icon={Mail}
        placeholder="example@email.com or 09123456789"
        autoComplete="email"
        error={errors.emailOrPhone?.message}
        {...register("emailOrPhone")}
      />

      <FormField
        label="Password"
        type="password"
        icon={Lock}
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="mb-6 flex items-center justify-between text-xs">
        <label className="flex items-center gap-1.5 text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            {...register("remember")}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          Remember me
        </label>
        <Link href="/forgot-password" className="text-accent hover:text-accent/80 transition-colors">
          Forgot password?
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(47,111,235,0.7)] transition-all hover:scale-[1.02] hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}