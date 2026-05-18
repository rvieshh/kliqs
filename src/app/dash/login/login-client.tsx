"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Floating Language Toggle (top-right corner) — shared export
// ─────────────────────────────────────────────────────────────────────────────

export function AuthLanguageToggle({ locale }: { locale: "en" | "id" }) {
  const router = useRouter();

  function switchLocale(newLocale: "en" | "id") {
    if (newLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="relative flex items-center bg-white border border-gray-200 rounded-full p-1 w-[120px] h-[40px] shadow-sm">
        <div
          className={`absolute top-1 h-[32px] w-[54px] bg-[#673de6]/10 rounded-full transition-transform duration-300 ease-in-out ${
            locale === "id" ? "translate-x-0" : "translate-x-[58px]"
          }`}
        />
        <button
          onClick={() => switchLocale("id")}
          className={`relative z-10 flex items-center justify-center w-[54px] h-[32px] rounded-full transition-opacity duration-200 cursor-pointer ${
            locale === "id" ? "opacity-100" : "opacity-50 hover:opacity-75"
          }`}
          aria-label="Switch to Bahasa Indonesia"
        >
          <Image src="/id.svg" alt="ID" width={20} height={20} className="w-5 h-5 rounded-sm" />
        </button>
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

interface AuthStrings {
  title: string;
  subtitle: string;
  googleBtn: string;
  githubBtn: string;
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
  [key: string]: string;
}

export function LoginClient({ auth, locale }: { auth: AuthStrings; locale: "en" | "id" }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = locale === "id" ? "Email wajib diisi" : "Email is required";
    }
    if (!password.trim()) {
      newErrors.password = locale === "id" ? "Kata sandi wajib diisi" : "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // For now, fall through to OAuth since credential auth isn't wired up
    signIn("credentials", { email, password, callbackUrl: "/dashboard" });
  }

  return (
    <>
      <AuthLanguageToggle locale={locale} />

      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f5f9] px-4 py-12">
        <div className="mb-8">
          <Image src="/logo.svg" alt="Kliqs.me" width={140} height={40} className="h-10 w-auto" />
        </div>

        <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <h1 className="text-[1.75rem] font-bold text-gray-900 text-center mb-2">
            {auth.title}
          </h1>

          {/* OAuth Buttons — OUTSIDE the form */}
          <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex items-center justify-center gap-3 h-14 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-sm font-medium text-sm text-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="flex items-center justify-center gap-3 h-14 bg-[#24292f] border border-[#24292f] rounded-xl hover:bg-[#32383f] transition-all cursor-pointer shadow-sm font-medium text-sm text-white"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400 font-medium">{auth.separator}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{auth.emailPlaceholder}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
                placeholder={auth.emailPlaceholder}
                className={`w-full px-4 py-3.5 border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#673de6] focus:ring-2 focus:ring-[#673de6]/10 transition-all ${errors.email ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{auth.passwordPlaceholder}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: undefined })); }}
                  placeholder={auth.passwordPlaceholder}
                  className={`w-full px-4 py-3.5 pr-12 border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#673de6] focus:ring-2 focus:ring-[#673de6]/10 transition-all ${errors.password ? "border-red-400" : "border-gray-200"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="text-right">
              <a href="/reset-password" className="text-sm font-medium text-[#673de6] hover:text-[#522eb1] transition-colors">{auth.forgotPassword}</a>
            </div>

            <button type="submit" className="w-full py-3.5 bg-[#673de6] text-white text-base font-semibold rounded-lg hover:bg-[#522eb1] active:bg-[#4527a0] transition-colors cursor-pointer shadow-[0_2px_8px_rgba(103,61,230,0.25)]">
              {auth.loginBtn}
            </button>
          </form>

          <p className="mt-5 text-sm text-center text-[#673de6] font-medium">
            <a href="/reset-password" className="hover:text-[#522eb1] transition-colors">{auth.cantAccess}</a>
          </p>
          <p className="mt-4 text-sm text-center text-gray-500">
            {auth.noAccount}{" "}
            <a href="/register" className="font-semibold text-[#673de6] hover:text-[#522eb1] transition-colors">{auth.signUp}</a>
          </p>
        </div>
      </div>
    </>
  );
}
