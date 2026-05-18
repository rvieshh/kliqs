"use client";

import { signIn } from "next-auth/react";
import { Link2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// Login Client Component — OAuth Sign-In
// Receives localized auth strings + current locale from server component.
// Includes a floating language toggle (top-right).
// ─────────────────────────────────────────────────────────────────────────────

interface AuthStrings {
  title: string;
  subtitle: string;
  googleBtn: string;
  githubBtn: string;
  termsDisclaimer: string;
  backToHome: string;
}

function AuthLanguageToggle({ locale }: { locale: "en" | "id" }) {
  const router = useRouter();

  function switchLocale(newLocale: "en" | "id") {
    if (newLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="relative flex items-center bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-full p-1 w-[120px] h-[40px] shadow-sm">
        {/* Sliding pill background */}
        <div
          className={`absolute top-1 h-[32px] w-[54px] bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
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

export function LoginClient({ auth, locale }: { auth: AuthStrings; locale: "en" | "id" }) {
  return (
    <>
      {/* Floating Language Toggle */}
      <AuthLanguageToggle locale={locale} />

      <main className="min-h-screen flex flex-col items-center justify-center bg-[#f7f9fc]">
        <div className="w-full max-w-sm mx-auto px-6">
          {/* Brand */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#635bff] flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Kliqs.me
            </span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              {auth.title}
            </h1>
            <p className="text-sm text-gray-500 text-center mb-8">
              {auth.subtitle}
            </p>

            <div className="space-y-3">
              {/* Google */}
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {auth.googleBtn}
              </button>

              {/* GitHub */}
              <button
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#24292f] border border-[#24292f] rounded-xl font-medium text-sm text-white hover:bg-[#32383f] transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                {auth.githubBtn}
              </button>
            </div>

            <p className="mt-6 text-xs text-center text-gray-400">
              {auth.termsDisclaimer}
            </p>
          </div>

          {/* Back link */}
          <p className="mt-6 text-sm text-center text-gray-500">
            <a href="https://home.kliqs.me" className="text-[#635bff] hover:underline underline-offset-4">
              {auth.backToHome}
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
