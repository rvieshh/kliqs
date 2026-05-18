import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { locales, getDictionary, type Locale } from "@/lib/i18n";
import { Footer } from "@/components/footer";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const dict = getDictionary(locale as Locale);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fc]">
      <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-5 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Kliqs.me" width={120} height={32} className="h-8 w-auto" />
          </Link>
          <Link
            href={`/${locale}`}
            className="text-sm font-medium text-[#635bff] hover:text-[#5145e5] transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full px-8 md:px-16 py-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{dict.privacy.title}</h1>
            <p className="text-sm text-gray-400 mb-10">{dict.privacy.lastUpdated}</p>

            <div className="space-y-8 text-gray-600 leading-relaxed text-base">
              {dict.privacy.sections.map((section, i) => (
                <section key={i}>
                  <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">{section.heading}</h2>
                  <p>{section.content}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
