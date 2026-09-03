"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Lock, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestRegisterOtp, verifyRegister } from "@/lib/auth";
import { useAuth } from "@/components/context/AuthContext";
import FormField from "./FormField";
import OtpInput from "./OtpInput";
import AuthSubmitButton from "./AuthSubmitButton";

type Step = "request" | "verify";

export default function RegisterForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>("request");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [otpValue, setOtpValue] = useState("");

  // Step 1: send OTP to the phone number
  async function handleRequestSubmit(event: FormEvent<HTMLFormElement>) {
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
      const response = await requestRegisterOtp(phoneValue);
      setPhone(phoneValue);
      setOtpValue("");
      setDevOtp(response.dev_otp_code ?? null);
      setStep("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ارسال کد ناموفق بود.");
    } finally {
      setIsLoading(false);
    }
  }

  // Step 2: verify OTP + set password
  async function handleVerifySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    if (otpValue.length !== 6) {
      setError("کد تایید باید ۶ رقم باشد.");
      return;
    }

    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setError("رمز عبور باید حداقل ۸ کاراکتر و شامل حرف و عدد باشد.");
      return;
    }

    setIsLoading(true);
    try {
      const tokens = await verifyRegister({
        phone,
        code: otpValue,
        password,
      });

      await login(tokens);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تأیید ثبت‌نام ناموفق بود.");
    } finally {
      setIsLoading(false);
    }
  }

  if (step === "request") {
    return (
      <form className="mt-2" onSubmit={handleRequestSubmit}>
        <p className="mb-5 text-center text-sm text-text-secondary">
          برای ساخت حساب، شماره موبایل خود را وارد کنید.
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
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/login" className="font-semibold text-accent hover:text-accent/80 transition-colors">
            ورود
          </Link>
        </p>
      </form>
    );
  }

  return (
    <form className="mt-2" onSubmit={handleVerifySubmit}>
      <p className="mb-5 text-center text-sm text-text-secondary">
        کد ۶ رقمی ارسال شده به شماره <span dir="ltr">{phone}</span> را وارد کنید.
      </p>

      <OtpInput name="code" value={otpValue} onChange={setOtpValue} />

      {devOtp && (
        <p className="mb-4 text-center text-xs text-green-400">
          Dev OTP (DEBUG): <span className="font-mono font-bold">{devOtp}</span>
        </p>
      )}

      <FormField
        label="رمز عبور"
        name="password"
        type="password"
        placeholder="حداقل ۸ کاراکتر، شامل حرف و عدد"
        icon={Lock}
        autoComplete="new-password"
      />

      {error && <p className="mb-4 text-center text-xs text-red-400">{error}</p>}

      <AuthSubmitButton label="تأیید و ساخت حساب" isLoading={isLoading} />

      <button
        type="button"
        onClick={() => {
          setStep("request");
          setError(null);
          setDevOtp(null);
        }}
        className="mt-4 flex w-full items-center justify-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary"
      >
        <ArrowRight className="h-4 w-4" />
        تغییر شماره موبایل
      </button>
    </form>
  );
}