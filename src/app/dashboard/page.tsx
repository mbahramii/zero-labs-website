"use client";

import { FileText, Calendar, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

// Import dashboard components
import ContentStats from "@/components/dashboard/ContentStats";
import AccountsSection from "@/components/dashboard/AccountsSection";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-bg px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">پنل کاربری</h1>
          <p className="mt-2 text-sm text-text-secondary">
            خوش آمدید! وضعیت حساب و فعالیت‌های خود را در یک نگاه بررسی کنید.
          </p>
        </div>

        {/* Summary Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={FileText}
            label="محتواهای تولید شده"
            value="۱۵"
            color="accent"
          />
          <StatCard
            icon={Calendar}
            label="منتشر شده"
            value="۴۲"
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            label="در انتظار انتشار"
            value="۱۴"
            color="yellow"
          />
          <StatCard
            icon={Sparkles}
            label="اعتبار باقی‌مانده"
            value="۰"
            color="purple"
          />
        </div>

        {/* Detailed Content Statistics Section */}
        <div className="mb-8">
          <ContentStats />
        </div>

        {/* Account & Phone Number Management Section */}
        <div className="mb-8">
          <AccountsSection />
        </div>

        {/* Quick Action Card */}
        <div className="rounded-2xl border border-border bg-surface-soft p-8 text-center">
          <Sparkles className="mx-auto mb-4 h-12 w-12 text-accent" />
          <h2 className="mb-2 text-xl font-bold text-text-primary">
            آماده‌ی تولید محتوا هستید؟
          </h2>
          <p className="mb-6 text-sm text-text-secondary">
            با هوش مصنوعی مزون‌فلو، محتوای حرفه‌ای بسازید و در چند ثانیه منتشر کنید.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(47,111,235,0.7)] transition-transform hover:scale-[1.03]"
          >
            <Sparkles className="h-4 w-4" />
            شروع تولید محتوا
          </Link>
        </div>
      </div>
    </main>
  );
}

// Helper component for summary stat cards
type StatCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: "accent" | "green" | "yellow" | "purple";
};

const colorMap = {
  accent: "bg-accent/10 text-accent",
  green: "bg-green-500/10 text-green-500",
  yellow: "bg-yellow-500/10 text-yellow-500",
  purple: "bg-purple-500/10 text-purple-500",
};

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface-soft p-5">
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="mt-1 text-2xl font-bold text-text-primary">{value}</p>
    </div>
  );
}