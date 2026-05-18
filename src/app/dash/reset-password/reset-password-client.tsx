"use client";

import Image from "next/image";
import { AuthLanguageToggle } from "../login/login-client";

// ─────────────────────────────────────────────────────────────────────────────
// Reset Password Client Component — HPanel Hostinger Style
// ─────────────────────────────────────────────────────────────────────────────

interface AuthStrings {
  emailPlaceholder: string;
  resetTitle: string;
  resetSubtitle: string;
  resetBtn: string;
  backToLogin: string;
}

export function ResetPasswordClient({ auth, locale }: { auth: AuthStrings; locale: "en" | "id" }) {
  return (
    <>
      {/* Floating Language Toggle */}
      <AuthLanguageToggle locale={locale} />

      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f5f9] px-4 py-12">
        {/* Logo */}
        <div className="mb-8">
          <Image src="/logo.svg" alt="Kliqs.me" width={140} height={40} className="h-10 w-auto" />
        </div>

        {/* Card */}
        <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Title */}
          <h1 className="text-[1.75rem] font-bold text-gray-900 text-center mb-2">
            {auth.resetTitle}
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            {auth.resetSubtitle}
          </p>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {auth.emailPlaceholder}
              </label>
              <input
                type="email"
                placeholder={auth.emailPlaceholder}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#673de6] focus:ring-2 focus:ring-[#673de6]/10 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#673de6] text-white text-base font-semibold rounded-lg hover:bg-[#522eb1] active:bg-[#4527a0] transition-colors cursor-pointer shadow-[0_2px_8px_rgba(103,61,230,0.25)]"
            >
              {auth.resetBtn}
            </button>
          </form>

          {/* Back to Login */}
          <p className="mt-6 text-sm text-center text-gray-500">
            <a href="/login" className="font-semibold text-[#673de6] hover:text-[#522eb1] transition-colors">
              {auth.backToLogin}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
