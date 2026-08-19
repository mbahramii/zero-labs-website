"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Phone } from "lucide-react";
import Link from "next/link";
import FormField from "./FormField";
import OtpInput from "./OtpInput";
import AuthSubmitButton from "./AuthSubmitButton";
import { requestPasswordReset, verifyResetCode, resetPassword } from "@/lib/auth";

type Step = "phone" | "otp" | "reset";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 // Values carried across steps
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [otpValue, setOtpValue] = useState("");

  async function handlePhoneSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const phoneValue = String(formData.get("phone") ?? "").trim();

    if (!phoneValue) {
      setError("لطفاً شماره موبایل را وارد کنید.");
      return;
    }

    if (!phoneValue.startsWith("09") && !phoneValue.startsWith("07")) {
      setError("شماره موبایل معتبر نیست.");
      return;
    }

  setIsLoading(true);
    try {
      // TEMP: backend not ready yet — skip the real API call and go
      // straight to the next step. Restore the line below once
      // /api/auth/forgot-password is live.
      // await requestPasswordReset(phoneValue);
      setPhone(phoneValue);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ارسال کد ناموفق بود.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const codeValue = String(formData.get("code") ?? "").trim();

    if (codeValue.length !== 6) {
      setError("کد تایید باید ۶ رقم باشد.");
      return;
    }

    setIsLoading(true);
    try {
      // TEMP: backend not ready yet — skip the real API call and go
      // straight to the next step. Restore the line below once
      // /api/auth/verify-reset-code is live.
      // await verifyResetCode({ phone, code: codeValue });
      setCode(codeValue);
      setStep("reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "کد وارد شده صحیح نیست.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!password || !confirmPassword) {
      setError("لطفاً همه فیلدها را تکمیل کنید.");
      return;
    }

    if (password.length < 8) {
      setError("رمز عبور حداقل ۸ کاراکتر باشد.");
      return;
    }

    if (password !== confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ phone, code, password });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تغییر رمز عبور ناموفق بود.");
    } finally {
      setIsLoading(false);
    }
  }

  // Step 1: collect the phone number
  if (step === "phone") {
    return (
      <form className="mt-2" onSubmit={handlePhoneSubmit}>
        <p className="mb-5 text-center text-sm text-text-secondary">
          شماره موبایل خود را وارد کنید تا کد تایید برایتان ارسال شود.
        </p>

        <FormField
          label="شماره موبایل"
          name="phone"
          type="tel"
          placeholder="09xxxxxxxxx"
          icon={Phone}
          autoComplete="tel"
        />

        {error && <p className="mb-4 text-center text-xs text-red-400">{error}</p>}

        <AuthSubmitButton label="ارسال کد تایید" isLoading={isLoading} />

        <p className="mt-6 text-center text-sm text-text-secondary">
          رمز عبورتان را به خاطر آوردید؟{" "}
          <Link href="/login" className="font-semibold text-accent-light hover:text-accent">
            ورود
          </Link>
        </p>
      </form>
    );
  }

  // Step 2: collect the 6-digit OTP code
  if (step === "otp") {
    return (
      <form className="mt-2" onSubmit={handleOtpSubmit}>
        <p className="mb-5 text-center text-sm text-text-secondary">
          کد ۶ رقمی ارسال شده به شماره <span dir="ltr">{phone}</span> را وارد کنید.
        </p>

        <OtpInput name="code" value={otpValue} onChange={setOtpValue} />

        {error && <p className="mb-4 text-center text-xs text-red-400">{error}</p>}

        <AuthSubmitButton label="تایید کد" isLoading={isLoading} />

        <button
          type="button"
          onClick={() => setStep("phone")}
          className="mt-4 flex w-full items-center justify-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary"
        >
          <ArrowRight className="h-4 w-4" />
          تغییر شماره موبایل
        </button>
      </form>
    );
  }

  // Step 3: set the new password
  return (
    <form className="mt-2" onSubmit={handleResetSubmit}>
      <FormField
        label="رمز عبور جدید"
        name="password"
        type="password"
        placeholder="رمز عبور جدید را وارد کنید"
        icon={Lock}
        autoComplete="new-password"
      />

      <FormField
        label="تکرار رمز عبور"
        name="confirmPassword"
        type="password"
        placeholder="رمز عبور جدید را دوباره وارد کنید"
        icon={Lock}
        autoComplete="new-password"
      />

      {error && <p className="mb-4 text-center text-xs text-red-400">{error}</p>}

      <AuthSubmitButton label="تغییر رمز عبور" isLoading={isLoading} />
    </form>
  );
}