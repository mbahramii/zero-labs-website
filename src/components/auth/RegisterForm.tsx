"use client";

import { useState } from "react";
import { Lock, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/schemas";
import { registerUser } from "@/lib/auth";
import { useAuth } from "@/components/context/AuthContext";
import FormField from "@/components/auth/FormField";

export default function RegisterForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterFormData) {
    setError(null);

    try {
      const response = await registerUser({
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      // Auto-login after successful registration
      login({ email: data.email }, response.token);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    }
  }

  return (
    <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Email Address"
        type="email"
        icon={Mail}
        placeholder="example@email.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <FormField
        label="Phone Number"
        type="tel"
        icon={Phone}
        placeholder="09123456789"
        autoComplete="tel"
        maxLength={11}
        error={errors.phone?.message}
        {...register("phone")}
      />

      <FormField
        label="Password"
        type="password"
        icon={Lock}
        placeholder="Create a strong password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

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
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent hover:text-accent/80 transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}