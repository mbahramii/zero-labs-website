import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      heading="خوش برگشتی"
      headingIcon={<span aria-hidden>👋</span>}
      subtitle="برای دسترسی به داشبورد وارد حساب خود شوید."
    >
      <LoginForm />
    </AuthShell>
  );
}