"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Loader2, User, CreditCard, Shield, Save, Check, AlertCircle, X, Lock } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

// ─────────────────────────────────────────────────────────────────────────────
// Settings Page — Manage account profile and billing
// ─────────────────────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: string;
}

interface Toast {
  type: "success" | "error";
  message: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Form state
  const [name, setName] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") fetchProfile();
  }, [status]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setName(data.user.name || "");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({ type: "error", message: data.error || "Failed to save" });
        return;
      }
      setUser(data.user);
      setToast({ type: "success", message: "Profile updated successfully!" });
    } catch {
      setToast({ type: "error", message: "Network error" });
    } finally {
      setIsSaving(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc]">
        <Loader2 className="w-8 h-8 text-[#4361ee] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f7f9fc] pt-14 lg:pt-0">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
          toast.type === "success" ? "bg-white border-emerald-200 text-emerald-700" : "bg-white border-red-200 text-red-700"
        }`}>
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 p-0.5 rounded hover:bg-gray-100 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <DashboardSidebar activePage="Settings" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#f7f9fc]/80 backdrop-blur-sm border-b border-gray-100 px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
              <p className="text-sm text-gray-400 mt-0.5">Manage your account and billing</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-6 lg:px-8 py-8 max-w-4xl space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-[#4361ee] animate-spin" />
            </div>
          ) : (
            <>
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee] transition-all placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email is managed by your authentication provider and cannot be changed here.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Member Since</label>
                    <input
                      type="text"
                      value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving || name === (user?.name || "")}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </section>

              {/* Billing & Plan */}
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
                    <p className="text-xs text-gray-400">10 links/day · 25 QR codes/month · 50 total links</p>
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
                    <p className="text-xs text-gray-400">Change your password</p>
                  </div>
                </div>
                <ChangePasswordForm onToast={setToast} />
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Change Password Form Component
// ─────────────────────────────────────────────────────────────────────────────

function ChangePasswordForm({ onToast }: { onToast: (toast: Toast) => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingPassword, setHasExistingPassword] = useState<boolean | null>(null);

  // Check if the user already has a password set
  useEffect(() => {
    async function checkPassword() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setHasExistingPassword(data.user.hasPassword ?? false);
        }
      } catch {
        // Default to assuming they have one (safer)
        setHasExistingPassword(true);
      }
    }
    checkPassword();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Client-side validation
    if (newPassword.length < 8) {
      onToast({ type: "error", message: "New password must be at least 8 characters" });
      return;
    }

    if (newPassword !== confirmPassword) {
      onToast({ type: "error", message: "New password and confirmation do not match" });
      return;
    }

    if (hasExistingPassword && !currentPassword) {
      onToast({ type: "error", message: "Current password is required" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/settings/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: hasExistingPassword ? currentPassword : undefined,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        onToast({ type: "error", message: data.error || "Failed to update password" });
        return;
      }

      onToast({ type: "success", message: data.message || "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setHasExistingPassword(true); // Now they have a password
    } catch {
      onToast({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {hasExistingPassword === null ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        </div>
      ) : (
        <>
          {!hasExistingPassword && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-100 mb-4">
              <Lock className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                You signed in via OAuth and don&apos;t have a password yet. Set one below for additional security.
              </p>
            </div>
          )}

          {hasExistingPassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-300"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-gray-300 ${
                passwordMismatch
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                  : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
              }`}
            />
            {passwordMismatch && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !newPassword || !confirmPassword || passwordMismatch}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {isSubmitting ? "Updating..." : hasExistingPassword ? "Update Password" : "Set Password"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
