import { KeyRound } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      heading="بازیابی رمز عبور"
      headingIcon={<KeyRound className="h-6 w-6 text-accent" />}
      subtitle=""
      showTabs={false}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}