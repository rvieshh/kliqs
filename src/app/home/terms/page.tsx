import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";

export default function TermsPage() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            <p className="text-sm text-gray-400 mb-10">Effective Date: January 1, 2025</p>

            <div className="space-y-8 text-gray-600 leading-relaxed text-base">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using the Kliqs.me platform (&ldquo;Service&rdquo;), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you must not access or use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">2. Description of Service</h2>
                <p>
                  Kliqs.me provides URL shortening, QR code generation, bio page hosting, and link analytics services. The platform is accessible to both anonymous guests and registered users, with certain advanced features available only to authenticated accounts.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">3. User Accounts</h2>
                <p className="mb-3">
                  Accounts may be created via third-party OAuth providers (Google, GitHub). You are responsible for maintaining the confidentiality of your account and for all activities conducted through it.
                </p>
                <p>
                  Links created by anonymous (guest) users are temporary and will be automatically purged after 24 hours. Registered users retain their links indefinitely unless they violate these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">4. Acceptable Use Policy</h2>
                <p className="mb-3">You agree not to use the Service to:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li>Create shortened URLs or QR codes pointing to phishing, malware, or scam websites</li>
                  <li>Distribute spam or engage in deceptive link redirection practices</li>
                  <li>Host content that is illegal, defamatory, obscene, or infringes intellectual property</li>
                  <li>Impersonate another individual or organization</li>
                  <li>Attempt to reverse-engineer, exploit, or overload the Service infrastructure</li>
                  <li>Use automated bots to mass-generate links without prior written authorization</li>
                  <li>Redirect to content promoting violence, hatred, or discrimination</li>
                </ul>
                <p className="mt-3">
                  Kliqs.me reserves the right to disable any link, suspend any account, or ban any user found violating this Acceptable Use Policy, without prior notice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">5. Account Suspension & Termination</h2>
                <p>
                  We may suspend or permanently terminate your account if we detect malicious or phishing links, excessive abuse of free-tier resources, or repeated violations of these Terms. Upon termination, all associated links and data may be permanently deleted.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">6. Payment Terms</h2>
                <p className="mb-3">
                  Kliqs.me offers free and paid subscription plans. Paid plans are billed on a monthly recurring basis. By subscribing to a paid plan, you authorize us to charge your selected payment method at the beginning of each billing cycle.
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li>All fees are quoted in Indonesian Rupiah (IDR) and are non-refundable unless required by law.</li>
                  <li>You may cancel your subscription at any time; access will continue until the end of the current billing period.</li>
                  <li>We reserve the right to modify pricing with 30 days&apos; advance notice to active subscribers.</li>
                  <li>Failed payment attempts may result in temporary service suspension until resolved.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">7. Intellectual Property</h2>
                <p>
                  The Kliqs.me platform, including its name, logo, design, source code, and documentation, is the exclusive property of OkaSpace. You may not reproduce, distribute, or create derivative works from any part of the Service without express written permission.
                </p>
                <p className="mt-3">
                  You retain ownership of any content you create or submit through the Service. By using the platform, you grant us a limited, non-exclusive license to host and display your content as necessary to provide the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">8. Service Availability</h2>
                <p>
                  We strive for maximum uptime but do not guarantee uninterrupted availability. The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control. We are not liable for any loss arising from downtime.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">9. Limitation of Liability</h2>
                <p>
                  To the fullest extent permitted by applicable law, Kliqs.me, OkaSpace, and their operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of revenue, data, business opportunities, or goodwill, arising from or related to your use of the Service.
                </p>
                <p className="mt-3">
                  The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis, without warranties of any kind, whether express, implied, or statutory.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">10. Indemnification</h2>
                <p>
                  You agree to indemnify, defend, and hold harmless Kliqs.me and OkaSpace from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Service or violation of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">11. Modifications to Terms</h2>
                <p>
                  We may revise these Terms at any time by updating this page. Material changes will be communicated via email or an in-app notification. Your continued use of the Service after revisions take effect constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">12. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the Republic of Indonesia. Any disputes shall be resolved through arbitration in Jakarta, Indonesia.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">13. Contact</h2>
                <p>
                  For questions or concerns about these Terms of Service, contact us at{" "}
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
