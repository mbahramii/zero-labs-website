"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";

const NAV_LINKS = [
  { label: "خانه", href: "#" },
  { label: "امکانات", href: "#features" },
  { label: "نمونه‌ها", href: "#showcase" },
  { label: "قیمت‌گذاری", href: "#pricing" },
  { label: "منابع", href: "#resources" },
];

export default function Navbar() {
  // Controls the mobile dropdown menu only; desktop nav is always visible.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-lg font-bold text-text-primary">مزون‌فلو</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            ورود
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(47,111,235,0.7)] transition-transform hover:scale-[1.03]"
          >
            شروع رایگان
          </Link>
        </div>
        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
          className="text-text-primary md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div className="border-t border-border bg-bg px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-text-secondary hover:text-text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
            <Link href="/login" className="text-sm font-medium text-text-secondary">
              ورود
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-accent px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              شروع رایگان
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}