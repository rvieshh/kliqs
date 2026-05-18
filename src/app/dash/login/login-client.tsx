"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Login Client Component — HPanel Hostinger Style
// Standalone auth page with floating language toggle.
// ─────────────────────────────────────────────────────────────────────────────

interface AuthStrings {
  title: string;
  subtitle: string;
  googleBtn: string;
  githubBtn: string;
  facebookBtn: string;
  separator: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  loginBtn: string;
  forgotPassword: string;
  noAccount: string;
  signUp: string;
  cantAccess: string;
  termsDisclaimer: string;
  backToHome: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Floating Language Toggle (top-right corner)
// ─────────────────────────────────────────────────────────────────────────────

function AuthLanguageToggle({ locale }: { locale: "en" | "id" }) {
  const router = useRouter();

  function switchLocale(newLocale: "en" | "id") {
    if (newLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="relative flex items-center bg-white border border-gray-200 rounded-full p-1 w-[120px] h-[40px] shadow-sm">
        {/* Sliding pill background */}
        <div
          className={`absolute top-1 h-[32px] w-[54px] bg-[#673de6]/10 rounded-full transition-transform duration-300 ease-in-out ${
            locale === "id" ? "translate-x-0" : "translate-x-[58px]"
          }`}
        />

        {/* ID Flag Button */}
        <button
          onClick={() => switchLocale("id")}
          className={`relative z-10 flex items-center justify-center w-[54px] h-[32px] rounded-full transition-opacity duration-200 cursor-pointer ${
            locale === "id" ? "opacity-100" : "opacity-50 hover:opacity-75"
          }`}
          aria-label="Switch to Bahasa Indonesia"
        >
          <Image src="/id.svg" alt="ID" width={20} height={20} className="w-5 h-5 rounded-sm" />
        </button>

        {/* EN Flag Button */}
        <button
          onClick={() => switchLocale("en")}
          className={`relative z-10 flex items-center justify-center w-[54px] h-[32px] rounded-full transition-opacity duration-200 cursor-pointer ${
            locale === "en" ? "opacity-100" : "opacity-50 hover:opacity-75"
          }`}
          aria-label="Switch to English"
        >
          <Image src="/en.svg" alt="EN" width={20} height={20} className="w-5 h-5 rounded-sm" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Login UI
// ─────────────────────────────────────────────────────────────────────────────

export function LoginClient({ auth, locale }: { auth: AuthStrings; locale: "en" | "id" }) {
  const [showPassword, setShowPassword] = useState(false);

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
            {auth.title}
          </h1>

          {/* Social Login Buttons */}
          <div className="flex items-center justify-center gap-4 mt-6 mb-6">
            {/* Google */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex items-center justify-center w-14 h-14 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-sm"
              aria-label={auth.googleBtn}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>

            {/* Facebook */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex items-center justify-center w-14 h-14 bg-[#1877F2] border border-[#1877F2] rounded-xl hover:bg-[#166FE5] transition-all cursor-pointer shadow-sm"
              aria-label={auth.facebookBtn}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>

            {/* GitHub */}
            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="flex items-center justify-center w-14 h-14 bg-[#24292f] border border-[#24292f] rounded-xl hover:bg-[#32383f] transition-all cursor-pointer shadow-sm"
              aria-label={auth.githubBtn}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400 font-medium">{auth.separator}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); signIn("google", { callbackUrl: "/dashboard" }); }} className="space-y-4">
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {auth.passwordPlaceholder}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={auth.passwordPlaceholder}
                  className="w-full px-4 py-3.5 pr-12 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#673de6] focus:ring-2 focus:ring-[#673de6]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-sm font-medium text-[#673de6] hover:text-[#522eb1] transition-colors">
                {auth.forgotPassword}
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#673de6] text-white text-base font-semibold rounded-lg hover:bg-[#522eb1] active:bg-[#4527a0] transition-colors cursor-pointer shadow-[0_2px_8px_rgba(103,61,230,0.25)]"
            >
              {auth.loginBtn}
            </button>
          </form>

          {/* Can't Access */}
          <p className="mt-5 text-sm text-center text-[#673de6] font-medium">
            <a href="#" className="hover:text-[#522eb1] transition-colors">
              {auth.cantAccess}
            </a>
          </p>

          {/* Sign Up Link */}
          <p className="mt-4 text-sm text-center text-gray-500">
            {auth.noAccount}{" "}
            <a href="#" className="font-semibold text-[#673de6] hover:text-[#522eb1] transition-colors">
              {auth.signUp}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
