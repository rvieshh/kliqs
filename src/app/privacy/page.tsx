import Link from "next/link";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fc]">
      <main className="flex-1 w-full px-8 md:px-16 py-32">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#635bff] hover:text-[#5145e5] mb-8 transition-colors"
            >
              &larr; Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-base text-gray-400 mb-12">
              Last updated: May 18, 2025
            </p>

            <div className="space-y-10 text-gray-600 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
                <p>
                  This Privacy Policy explains how Kliqs.me (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, and protects your personal information when you use our URL shortening, QR code generation, and bio page services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
                <p className="mb-3">We collect the following types of information:</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li><strong>Account Information:</strong> Name, email address, and profile picture provided by third-party authentication providers (Google, GitHub).</li>
                  <li><strong>Link Data:</strong> URLs you shorten, custom slugs, and associated metadata.</li>
                  <li><strong>Analytics Data:</strong> Click counts, geographic location (country/city level), referrer URLs, device type, and browser information for links you create.</li>
                  <li><strong>Usage Data:</strong> Pages visited, features used, timestamps, and interaction patterns.</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, operating system, and device identifiers.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
                <p className="mb-3">We use collected information to:</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>Provide, operate, and maintain the Service</li>
                  <li>Generate link analytics and click statistics</li>
                  <li>Authenticate your identity and manage your account</li>
                  <li>Communicate important service updates</li>
                  <li>Detect and prevent abuse, fraud, and security threats</li>
                  <li>Improve and optimize our platform experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Sharing</h2>
                <p className="mb-3">
                  We do not sell your personal information to third parties. We may share data in the following limited circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li><strong>Service Providers:</strong> Trusted third-party services that help us operate the platform (hosting, analytics, authentication).</li>
                  <li><strong>Legal Requirements:</strong> When required by law, regulation, or valid legal process.</li>
                  <li><strong>Safety:</strong> To protect the rights, safety, or property of Kliqs.me, our users, or the public.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Retention</h2>
                <p className="mb-3">
                  We retain your data according to the following policies:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li><strong>Guest links:</strong> Automatically deleted after 24 hours.</li>
                  <li><strong>Registered user data:</strong> Retained for the duration of your account activity. You may request deletion at any time.</li>
                  <li><strong>Analytics data:</strong> Aggregated analytics may be retained indefinitely in anonymized form.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cookies & Tracking</h2>
                <p>
                  We use essential cookies for authentication and session management. We may use analytics cookies to understand how users interact with our Service. You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">7. Security</h2>
                <p>
                  We implement industry-standard security measures including encryption in transit (TLS/SSL), secure authentication flows, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">8. Your Rights</h2>
                <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to or restrict processing of your data</li>
                  <li>Export your data in a portable format</li>
                </ul>
                <p className="mt-3">
                  To exercise any of these rights, contact us at{" "}
                  <a href="mailto:support@kliqs.me" className="text-[#635bff] hover:underline">
                    support@kliqs.me
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">9. Children&apos;s Privacy</h2>
                <p>
                  The Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If we discover that a child has provided us with personal data, we will delete it promptly.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">10. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify users of significant changes by posting a notice on the Service. Continued use after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contact Us</h2>
                <p>
                  If you have questions or concerns about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:support@kliqs.me" className="text-[#635bff] hover:underline">
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
