"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Phone } from "lucide-react";
import Link from "next/link";
import FormField from "./FormField";
import OtpInput from "./OtpInput";
import AuthSubmitButton from "./AuthSubmitButton";
import { requestPasswordReset, confirmPasswordReset } from "@/lib/auth";

type Step = "phone" | "otp" | "reset";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [otpValue, setOtpValue] = useState("");

  // Step 1: send reset OTP
  async function handlePhoneSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const phoneValue = String(formData.get("phone") ?? "").trim();

    if (!/^09\d{9}$/.test(phoneValue)) {
      setError("شماره موبایل معتبر نیست (مثال: 09123456789).");
      return;
    }

    setIsLoading(true);
    try {
      const response = await requestPasswordReset(phoneValue);
      setPhone(phoneValue);
      setOtpValue("");
      setDevOtp(response.dev_otp_code ?? null);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ارسال کد ناموفق بود.");
    } finally {
      setIsLoading(false);
    }
  }

  // Step 2: collect OTP (backend verifies it at the confirm step)
  async function handleOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const codeValue = otpValue.trim();

    if (codeValue.length !== 6) {
      setError("کد تایید باید ۶ رقم باشد.");
      return;
    }

    setCode(codeValue);
    setStep("reset");
  }

  // Step 3: set the new password
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
      await confirmPasswordReset({ phone, code, new_password: password });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تغییر رمز عبور ناموفق بود.");
    } finally {
      setIsLoading(false);
    }
  }

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

  if (step === "otp") {
    return (
      <form className="mt-2" onSubmit={handleOtpSubmit}>
        <p className="mb-5 text-center text-sm text-text-secondary">
          کد ۶ رقمی ارسال شده به شماره <span dir="ltr">{phone}</span> را وارد کنید.
        </p>

        <OtpInput name="code" value={otpValue} onChange={setOtpValue} />

        {devOtp && (
          <p className="mb-4 text-center text-xs text-green-400">
            Dev OTP (DEBUG): <span className="font-mono font-bold">{devOtp}</span>
          </p>
        )}

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