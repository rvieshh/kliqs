import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kliqs.me — Shorten Any URL Instantly",
  description:
    "The fastest, cleanest URL shortener. Paste a link, get a short one. No signup required.",
  keywords: ["url shortener", "short link", "kliqs", "link shortener"],
  openGraph: {
    title: "Kliqs.me — Shorten Any URL Instantly",
    description: "The fastest, cleanest URL shortener. No signup required.",
    url: "https://home.kliqs.me",
    siteName: "Kliqs.me",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
