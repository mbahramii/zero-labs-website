"use client";

import { useState } from "react";
import { Lock, Phone } from "lucide-react";
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
      phone: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setError(null);

    try {
      const response = await loginUser({
        phone: data.phone,
        password: data.password,
      });

      await login(response);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    }
  }

  return (
    <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Phone Number"
        type="tel"
        icon={Phone}
        placeholder="09123456789"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
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
        <span />
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