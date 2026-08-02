import type { ReactNode } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import AuthTabs from "./AuthTabs";

type AuthShellProps = {
  heading: string;
  headingIcon?: ReactNode;
  subtitle: string;
  children: ReactNode;
};

export default function AuthShell({ heading, headingIcon, subtitle, children }: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16">
      {/* Logo, pinned to the page corner rather than the card */}
      <Link href="/" className="absolute left-6 top-6 flex items-center gap-2 sm:left-10 sm:top-10">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold text-text-primary">مزون‌فلو</span>
      </Link>

      <div className="neu-card w-full max-w-lg rounded-[2rem] p-8 sm:p-10">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-center text-2xl font-extrabold text-text-primary sm:text-3xl">
          {heading}
          {headingIcon}
        </h1>
        <p className="mb-8 text-center text-sm text-text-secondary">{subtitle}</p>

        <AuthTabs />

        {children}
      </div>
    </main>
  );
}