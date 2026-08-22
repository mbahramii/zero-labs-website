"use client";

import { useState } from "react";
import { Send, Camera, X, CheckCircle, AlertCircle } from "lucide-react";

// Props interface for the modal component
interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Platform configuration data
const platforms = [
  { 
    id: "telegram", 
    name: "تلگرام", 
    icon: Send,
    color: "bg-blue-500 hover:bg-blue-600",
    description: "اتصال به کانال یا گروه تلگرامی"
  },
  { 
    id: "instagram", 
    name: "اینستاگرام", 
    icon: Camera,
    color: "bg-pink-500 hover:bg-pink-600",
    description: "اتصال به پیج اینستاگرام"
  },
];

// Helper component to display inline success/error messages
function FeedbackMessage({ type, message }: { type: "success" | "error"; message: string }) {
  if (!message) return null;
  
  return (
    <div className={`mb-4 flex items-center gap-2 rounded-lg border p-3 text-sm ${
      type === "success" 
        ? "border-green-500/20 bg-green-500/10 text-green-500" 
        : "border-red-500/20 bg-red-500/10 text-red-500"
    }`}>
      {type === "success" ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
      <span>{message}</span>
    </div>
  );
}

export default function AddAccountModal({ isOpen, onClose }: AddAccountModalProps) {
  // State for platform selection and loading status
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle connection process (Simulated API call)
  const handleConnect = async (platformId: string) => {
    setFeedback(null);
    setIsLoading(true);
    
    // TODO: Implement real OAuth or API connection logic here
    setTimeout(() => {
      setIsLoading(false);
      setFeedback({ 
        type: "success", 
        message: `درخواست اتصال به ${platformId} با موفقیت ثبت شد. (نیاز به پیاده‌سازی API)` 
      });
    }, 1500);
  };

  // Do not render if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface-soft p-6 m-4 shadow-2xl">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute left-4 top-4 text-text-secondary hover:text-text-primary">
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-bold text-text-primary mb-6 pr-8">
          اتصال اکانت جدید
        </h2>

        {/* Inline Feedback Area */}
        {feedback && <FeedbackMessage type={feedback.type} message={feedback.message} />}

        {!selectedPlatform ? (
          // Platform Selection View
          <div className="space-y-3">
            <p className="text-sm text-text-secondary mb-4">پلتفرم مورد نظر خود را انتخاب کنید:</p>
            
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => {
                  setSelectedPlatform(platform.id);
                  setFeedback(null);
                }}
                className="w-full flex items-start gap-4 rounded-xl border border-border bg-bg p-4 text-right transition-all hover:border-accent hover:shadow-md"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${platform.color} text-white`}>
                  <platform.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">{platform.name}</h3>
                  <p className="mt-1 text-xs text-text-secondary">{platform.description}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Connection Confirmation View
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-text-primary">
                اتصال به {platforms.find(p => p.id === selectedPlatform)?.name}
              </h3>
              <button onClick={() => setSelectedPlatform(null)} className="text-text-secondary hover:text-text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="rounded-xl border border-border bg-bg p-6 text-center">
              <p className="text-sm text-text-secondary mb-4">
                برای اتصال، باید از طریق API پلتفرم احراز هویت شوید. این بخش در نسخه بعدی پیاده‌سازی خواهد شد.
              </p>
              <button 
                onClick={() => handleConnect(selectedPlatform)}
                disabled={isLoading}
                className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? "در حال پردازش..." : "ادامه فرآیند اتصال"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}