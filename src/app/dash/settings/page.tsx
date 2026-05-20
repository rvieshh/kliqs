"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Settings, Loader2, User, CreditCard, Shield } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Settings Page — Manage account and billing (placeholder)
// ─────────────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { data: session, status } = useSession();

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

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your account and billing</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-8 space-y-6">
        {/* Profile Settings */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#4361ee]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#4361ee]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Profile</h2>
              <p className="text-xs text-gray-400">Your personal information</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
              <input
                type="text"
                defaultValue={userName}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                defaultValue={userEmail}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400">Profile editing coming soon. Currently managed via your authentication provider.</p>
          </div>
        </section>

        {/* Billing */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Billing & Plan</h2>
              <p className="text-xs text-gray-400">Manage your subscription</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
            <div>
              <p className="text-sm font-semibold text-gray-900">Free Plan</p>
              <p className="text-xs text-gray-400">10 links/day, 25 QR codes/month</p>
            </div>
            <button className="px-4 py-2 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] transition-colors cursor-pointer">
              Upgrade
            </button>
          </div>
        </section>

        {/* Security */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Security</h2>
              <p className="text-xs text-gray-400">Account security settings</p>
            </div>
          </div>
          <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-xl">
            <div className="text-center">
              <Settings className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Security settings coming soon</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
