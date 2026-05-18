import Link from "next/link";
import { Footer } from "@/components/footer";

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-base text-gray-400 mb-12">
              Last updated: May 18, 2025
            </p>

            <div className="space-y-10 text-gray-600 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using Kliqs.me (the &ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
                <p>
                  Kliqs.me provides URL shortening, QR code generation, bio page creation, and link analytics services. The Service is available to both registered and unregistered users, with certain features restricted to authenticated accounts.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
                <p className="mb-3">
                  You may create an account using third-party authentication providers (Google, GitHub). You are responsible for maintaining the security of your account credentials and for all activities that occur under your account.
                </p>
                <p>
                  Guest-created links are temporary and will be automatically deleted after 24 hours unless claimed by a registered account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">4. Acceptable Use</h2>
                <p className="mb-3">You agree not to use the Service to:</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>Create links to illegal, harmful, or malicious content</li>
                  <li>Distribute spam, phishing, or malware</li>
                  <li>Infringe on intellectual property rights of others</li>
                  <li>Impersonate any person or entity</li>
                  <li>Attempt to exploit or disrupt the Service infrastructure</li>
                  <li>Violate any applicable local, national, or international laws</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">5. Content & Links</h2>
                <p>
                  You are solely responsible for the content of any URLs you shorten or pages you create through the Service. Kliqs.me reserves the right to disable or remove any link that violates these terms without prior notice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">6. Service Availability</h2>
                <p>
                  Kliqs.me strives to maintain high availability but does not guarantee uninterrupted access. We may modify, suspend, or discontinue any part of the Service at any time without prior notice or liability.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">7. Intellectual Property</h2>
                <p>
                  The Service, including its design, logos, and underlying technology, is owned by OkaSpace. You retain ownership of any content you create through the Service but grant us a limited license to host and display it as necessary to provide the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, Kliqs.me and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. The Service is provided &ldquo;as is&rdquo; without warranties of any kind.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">9. Termination</h2>
                <p>
                  We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">10. Changes to Terms</h2>
                <p>
                  We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated terms. We encourage you to review this page periodically.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contact</h2>
                <p>
                  If you have questions about these Terms, please contact us at{" "}
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
