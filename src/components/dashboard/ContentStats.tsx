"use client";

import { FileText, CheckCircle, Clock } from "lucide-react";

// Mock statistics data - Replace with real API data later
const mockStats = {
  total: 156,
  sent: 142,
  pending: 14,
};

export default function ContentStats() {
  return (
    <div className="rounded-2xl border border-border bg-surface-soft p-6">
      <h2 className="text-lg font-bold text-text-primary mb-4">آمار محتوا</h2>
      
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Content Card */}
        <div className="rounded-xl border border-border bg-bg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">کل محتوا</p>
              <p className="text-2xl font-bold text-text-primary">{mockStats.total}</p>
            </div>
          </div>
        </div>

        {/* Sent Content Card */}
        <div className="rounded-xl border border-border bg-bg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">ارسال شده</p>
              <p className="text-2xl font-bold text-text-primary">{mockStats.sent}</p>
            </div>
          </div>
        </div>

        {/* Pending Content Card */}
        <div className="rounded-xl border border-border bg-bg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">در انتظار</p>
              <p className="text-2xl font-bold text-text-primary">{mockStats.pending}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}