import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fc]">
      {/* Header */}
      <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Kliqs.me" width={120} height={32} className="h-8 w-auto" />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[#635bff] hover:text-[#5145e5] transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full px-8 md:px-16 py-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            <p className="text-sm text-gray-400 mb-10">Effective Date: January 1, 2025</p>

            <div className="space-y-8 text-gray-600 leading-relaxed text-base">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">1. Introduction</h2>
                <p>
                  This Privacy Policy describes how Kliqs.me (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), operated by OkaSpace, collects, uses, stores, and protects your personal information when you use our URL shortening, QR code generation, bio page, and link analytics services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">2. Information We Collect</h2>
                <p className="mb-3">We collect information in the following categories:</p>

                <h3 className="text-base font-semibold text-gray-800 mt-4 mb-1">2.1 Account Registration Data</h3>
                <p>
                  When you sign up via Google or GitHub OAuth, we receive and store your name, email address, and profile avatar as provided by the authentication provider. We do not store or have access to your OAuth passwords.
                </p>

                <h3 className="text-base font-semibold text-gray-800 mt-4 mb-1">2.2 URLs and Content Submitted</h3>
                <p>
                  We store the original long URLs you submit for shortening, any custom slugs or aliases you configure, QR code data, and bio page content you create.
                </p>

                <h3 className="text-base font-semibold text-gray-800 mt-4 mb-1">2.3 Analytics & Click Data</h3>
                <p>
                  For each click on a shortened link, we collect: IP address (anonymized after processing), approximate geographic location (country and city level), referrer URL, browser/user-agent string, device type, and timestamp. This data powers the analytics dashboard for link owners.
                </p>

                <h3 className="text-base font-semibold text-gray-800 mt-4 mb-1">2.4 Technical & Usage Data</h3>
                <p>
                  We automatically collect server logs including IP address, browser type, operating system, pages visited, features used, and session duration for security monitoring and service improvement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">3. How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li>To provide, operate, and maintain the core URL shortening and analytics services</li>
                  <li>To authenticate your identity and manage user sessions</li>
                  <li>To generate click analytics reports visible to link owners</li>
                  <li>To detect, prevent, and respond to abuse, spam, phishing, and security threats</li>
                  <li>To communicate important service updates, security alerts, or policy changes</li>
                  <li>To improve and optimize platform performance and user experience</li>
                  <li>To comply with legal obligations and enforce our Terms of Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">4. Data Storage & Retention</h2>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li><strong>Guest (anonymous) links:</strong> Automatically deleted after 24 hours along with all associated click data.</li>
                  <li><strong>Registered user links:</strong> Retained indefinitely while the account is active. Deleted upon account termination or user request.</li>
                  <li><strong>Account data:</strong> Retained for the lifetime of the account. Deleted within 30 days of account deletion request.</li>
                  <li><strong>Analytics data:</strong> Raw click data retained for 12 months. Aggregated, anonymized statistics may be retained indefinitely.</li>
                  <li><strong>Server logs:</strong> Retained for 90 days for security and debugging purposes, then purged.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">5. Cookies & Tracking Technologies</h2>
                <p className="mb-3">We use the following types of cookies:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li><strong>Essential Cookies:</strong> Required for authentication, session management, and CSRF protection. These cannot be disabled.</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our platform (page views, feature usage). These are anonymized.</li>
                  <li><strong>Preference Cookies:</strong> Store your UI preferences such as theme settings.</li>
                </ul>
                <p className="mt-3">
                  You can manage cookie preferences through your browser settings. Disabling essential cookies may prevent you from using authenticated features of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">6. Data Sharing & Third Parties</h2>
                <p className="mb-3">We do not sell your personal information. We may share data with:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li><strong>Infrastructure Providers:</strong> Cloud hosting (for data storage and delivery), authentication services (Google, GitHub OAuth).</li>
                  <li><strong>Security Services:</strong> Fraud detection and abuse prevention tools.</li>
                  <li><strong>Legal Authorities:</strong> When required by valid legal process, court order, or to protect the safety of our users or the public.</li>
                </ul>
                <p className="mt-3">
                  All third-party service providers are contractually obligated to handle your data securely and only for the purposes we specify.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">7. Data Security</h2>
                <p>
                  We implement industry-standard security practices including: TLS/SSL encryption for all data in transit, encrypted storage for sensitive credentials, regular security audits, access controls with principle of least privilege, and automated threat monitoring. However, no system is 100% secure, and we cannot guarantee absolute protection against all threats.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">8. Your Privacy Rights</h2>
                <p className="mb-3">Depending on your jurisdiction, you may have the following rights:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li><strong>Right of Access:</strong> Request a copy of the personal data we hold about you.</li>
                  <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your personal data and account.</li>
                  <li><strong>Right to Restriction:</strong> Request that we limit processing of your data.</li>
                  <li><strong>Right to Portability:</strong> Receive your data in a structured, machine-readable format.</li>
                  <li><strong>Right to Object:</strong> Object to processing based on legitimate interests.</li>
                </ul>
                <p className="mt-3">
                  To exercise any of these rights, email us at{" "}
                  <a href="mailto:support@kliqs.me" className="text-[#635bff] hover:underline font-medium">
                    support@kliqs.me
                  </a>. We will respond within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">9. International Data Transfers</h2>
                <p>
                  Our servers are located in Southeast Asia. If you access the Service from outside this region, your data may be transferred to and processed in a jurisdiction with different data protection laws. By using the Service, you consent to such transfers.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">10. Children&apos;s Privacy</h2>
                <p>
                  Kliqs.me is not directed at children under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will take steps to delete it promptly.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">11. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy periodically. Material changes will be announced via email notification or an in-app banner. The &ldquo;Effective Date&rdquo; at the top indicates when the latest revision took effect. Continued use of the Service constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">12. Contact Us</h2>
                <p>
                  For any questions, concerns, or data requests related to this Privacy Policy, please contact our Data Protection team at{" "}
                  <a href="mailto:support@kliqs.me" className="text-[#635bff] hover:underline font-medium">
                    support@kliqs.me
                  </a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
