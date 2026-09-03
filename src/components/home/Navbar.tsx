"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Sparkles, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";

const PUBLIC_NAV_LINKS = [
  { label: "خانه", href: "/" },
  { label: "امکانات", href: "#features" },
  { label: "قیمت‌گذاری", href: "#pricing" },
];

const AUTHENTICATED_NAV_LINKS = [
  { label: "خانه", href: "/" },
  { label: "محتواهای من", href: "/contents" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-user-menu]")) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Close mobile menu with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const navLinks = user ? AUTHENTICATED_NAV_LINKS : PUBLIC_NAV_LINKS;

  // Helper: نمایش نام کاربر (ترجیح display_name، وگرنه phone_number)
  const displayName = user?.display_name ?? user?.phone_number ?? "کاربر";
  const displayDetail = user?.display_name ? user.phone_number : null;

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
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {/* User panel button (secondary) */}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                پنل کاربری
              </Link>

              {/* Create content button (primary CTA) */}
              <Link
                href="/create"
                className="flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(47,111,235,0.7)] transition-transform hover:scale-[1.03]"
              >
                <Sparkles className="h-4 w-4" />
                تولید و انتشار   
              </Link>

              {/* User menu dropdown */}
              <div className="relative" data-user-menu>
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-border p-1 pr-3 transition-colors hover:border-border-strong"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <User className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {displayName}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 rounded-xl border border-border bg-bg shadow-xl">
                    <div className="border-b border-border p-3">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {displayName}
                      </p>
                      {displayDetail && (
                        <p className="truncate text-xs text-text-tertiary" dir="ltr">
                          {displayDetail}
                        </p>
                      )}
                    </div>
                    <div className="p-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        پنل کاربری
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary"
                      >
                        <User className="h-4 w-4" />
                        تنظیمات حساب
                      </Link>
                      <button
                        onClick={async () => {
                          setIsUserMenuOpen(false);
                          await logout();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        خروج از حساب
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
            {navLinks.map((link) => (
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
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-center text-sm font-medium text-text-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  پنل کاربری
                </Link>
                <Link
                  href="/create"
                  className="flex items-center justify-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-center text-sm font-semibold text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Sparkles className="h-4 w-4" />
                  تولید محتوا
                </Link>
                <button
                  onClick={async () => {
                    setIsMenuOpen(false);
                    await logout();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-center text-sm font-medium text-red-400 hover:border-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  خروج از حساب
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-text-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ورود
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-accent px-5 py-2.5 text-center text-sm font-semibold text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  شروع رایگان
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}