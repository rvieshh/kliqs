"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { BarChart3, Loader2, TrendingUp, MousePointerClick, Globe } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Analytics Page — Detailed traffic insights (placeholder)
// ─────────────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc]">
        <Loader2 className="w-8 h-8 text-[#4361ee] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 lg:px-8 py-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Detailed traffic insights</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#4361ee]/10 flex items-center justify-center">
              <MousePointerClick className="w-5 h-5 text-[#4361ee]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">—</p>
              <p className="text-xs text-gray-400">Total Clicks</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">—</p>
              <p className="text-xs text-gray-400">Click Growth</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">—</p>
              <p className="text-xs text-gray-400">Top Country</p>
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#4361ee]/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#4361ee]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Click Analytics</h2>
              <p className="text-xs text-gray-400">Clicks over the last 30 days</p>
            </div>
          </div>
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-400">Charts coming soon</p>
              <p className="text-xs text-gray-300 mt-1">Detailed click analytics and geographic data will appear here.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
