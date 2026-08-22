"use client";

import { useState } from "react";
import { Phone, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

// Props interface for the modal component
interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Callback to notify parent component when a user is successfully added
  onAddSuccess?: (phoneNumber: string) => void;
}

// Helper component to display inline success/error messages
function FeedbackMessage({ type, message }: { type: "success" | "error"; message: string }) {
  if (!message) return null;
  
  const isSuccess = type === "success";
  
  return (
    <div className={`mb-4 flex items-center gap-2 rounded-lg border p-3 text-sm ${
      isSuccess 
        ? "border-green-500/20 bg-green-500/10 text-green-500" 
        : "border-red-500/20 bg-red-500/10 text-red-500"
    }`}>
      {isSuccess ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
      <span>{message}</span>
    </div>
  );
}

export default function AddUserModal({ isOpen, onClose, onAddSuccess }: AddUserModalProps) {
  // State management for form steps and feedback
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Helper to show temporary feedback messages
  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    if (type === "error") {
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  // Handle sending OTP code (Simulated API call)
  const handleSendOTP = async () => {
    setFeedback(null);
    
    if (!phoneNumber || phoneNumber.length < 10) {
      showFeedback("error", "لطفاً یک شماره تلفن معتبر وارد کنید.");
      return;
    }

    setIsLoading(true);
    
    // TODO: Replace with actual API endpoint
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      showFeedback("success", "کد تأیید با موفقیت ارسال شد.");
    }, 1500);
  };

  // Handle verifying OTP code (Simulated API call)
  const handleVerifyOTP = async () => {
    setFeedback(null);

    if (!otpCode || otpCode.length !== 5) {
      showFeedback("error", "لطفاً کد ۵ رقمی را کامل وارد کنید.");
      return;
    }

    setIsLoading(true);
    
    // TODO: Replace with actual API endpoint
    setTimeout(() => {
      setIsLoading(false);
      showFeedback("success", "شماره تلفن با موفقیت اضافه شد!");
      
      // Notify parent component to update the list immediately
      if (onAddSuccess) {
        onAddSuccess(phoneNumber);
      }
      
      // Delay closing to let user see the success message
      setTimeout(() => {
        onClose();
        // Reset form state after modal closes
        setTimeout(() => {
          setStep("phone");
          setPhoneNumber("");
          setOtpCode("");
          setFeedback(null);
        }, 300);
      }, 1500);
      
    }, 1500);
  };

  // Do not render if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface-soft p-6 m-4 shadow-2xl">
        
        {/* Modal Title */}
        <h2 className="text-xl font-bold text-text-primary mb-6">
          {step === "phone" ? "افزودن شماره جدید" : "تأیید شماره تلفن"}
        </h2>

        {/* Inline Feedback Area */}
        {feedback && <FeedbackMessage type={feedback.type} message={feedback.message} />}

        {step === "phone" ? (
          // Step 1: Phone Number Input
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-bg p-6">
              <Phone className="h-12 w-12 text-accent mx-auto mb-4" />
              
              <label className="block text-sm font-medium text-text-secondary mb-2">
                شماره تلفن
              </label>
              <input
                type="tel"
                placeholder="مثال: 09123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-soft py-3 px-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 text-left dir-ltr"
                disabled={isLoading}
              />
              
              <p className="mt-3 text-xs text-text-secondary">
                یک کد تأیید ۵ رقمی به این شماره ارسال خواهد شد.
              </p>

              <button 
                onClick={handleSendOTP} 
                disabled={isLoading}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  "ارسال کد تأیید"
                )}
              </button>
            </div>
          </div>
        ) : (
          // Step 2: OTP Verification
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-bg p-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              
              <p className="text-sm text-text-secondary text-center mb-4">
                کد تأیید به <span className="font-semibold text-text-primary">{phoneNumber}</span> ارسال شد
              </p>

              <label className="block text-sm font-medium text-text-secondary mb-2">
                کد تأیید
              </label>
              <input
                type="text"
                placeholder="کد ۵ رقمی"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
                className="w-full rounded-xl border border-border bg-surface-soft py-3 px-4 text-center text-2xl tracking-widest text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 dir-ltr"
                maxLength={5}
                disabled={isLoading}
              />
              
              <button 
                onClick={handleVerifyOTP} 
                disabled={isLoading}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    در حال بررسی...
                  </>
                ) : (
                  "تأیید و ذخیره"
                )}
              </button>

              <button
                onClick={() => {
                  setStep("phone");
                  setOtpCode("");
                  setFeedback(null);
                }}
                className="w-full mt-3 text-sm text-text-secondary hover:text-accent transition-colors"
              >
                تغییر شماره تلفن
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}