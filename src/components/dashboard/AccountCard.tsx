"use client";

import { Users, Send } from "lucide-react";

// Props interface for account card
interface AccountCardProps {
  type: "user" | "account";
  name: string;
  status: "active" | "pending" | "inactive";
  platform?: string;
}

// Status color mapping
const statusColors = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  inactive: "bg-red-500/10 text-red-500 border-red-500/20",
};

// Status label mapping
const statusLabels = {
  active: "Active",
  pending: "Pending",
  inactive: "Inactive",
};

export default function AccountCard({ type, name, status, platform }: AccountCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface-soft p-4 transition-all hover:border-accent hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Icon based on type */}
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${type === "user" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"}`}>
            {type === "user" ? <Users className="h-5 w-5" /> : <Send className="h-5 w-5" />}
          </div>
          
          <div>
            <h3 className="font-semibold text-text-primary">{name}</h3>
            {platform && (
              <p className="text-xs text-text-secondary mt-0.5">{platform}</p>
            )}
          </div>
        </div>
        
        {/* Status badge */}
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </div>
    </div>
  );
}