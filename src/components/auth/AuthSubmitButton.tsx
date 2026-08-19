import { ArrowLeft, Loader2 } from "lucide-react";

export default function AuthSubmitButton({
  label,
  isLoading = false,
}: {
  label: string;
  isLoading?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-accent to-accent-light py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_-12px_rgba(47,111,235,0.7)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeft className="h-4 w-4" />}
      {label}
    </button>
  );
}