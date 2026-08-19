"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";

// Order matters for RTL: the first item renders on the right, the second
// on the left — this matches the reference design where "ورود" is always
// on the right and "ثبت‌نام" always on the left, regardless of which page
// is active.
const TABS = [
  { href: "/login", label: "ورود", icon: LogIn },
  { href: "/register", label: "ثبت‌نام", icon: UserPlus },
];

export default function AuthTabs() {
  const pathname = usePathname();

  return (
    <div className="mb-8 grid grid-cols-2 gap-1 rounded-2xl border border-border bg-surface-soft p-1">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-accent/15 text-accent-light shadow-[0_0_0_1px_rgba(59,130,246,0.4)]"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            {tab.label}
            <tab.icon className="h-4 w-4" />
          </Link>
        );
      })}
    </div>
  );
}