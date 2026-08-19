import { UserPlus } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      heading="ساخت حساب جدید"
      headingIcon={<UserPlus className="h-6 w-6 text-accent" />}
      subtitle="در کمتر از یک دقیقه عضو مزون‌فلو شوید."
    >
      <RegisterForm />
    </AuthShell>
  );
}