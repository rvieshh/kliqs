export interface Translations {
  locale: string;
  nav: { shortener: string; analytics: string; qrCodes: string; microsite: string; pricing: string; loginRegister: string; dashboard: string };
  hero: { headline: string; subtitle: string; trust: string };
  tabs: { shortener: string; qr: string; bio: string };
  shortener: { placeholder: string; button: string; loading: string; resultLabel: string; copy: string; copied: string; error: string; networkError: string };
  qr: { placeholder: string; button: string; download: string; error: string };
  bio: { placeholder: string; suffix: string; button: string; error: string };
  guestWarning: string;
  guestWarningCta: string;
  guestWarningEnd: string;
  features: {
    title: string; subtitle: string;
    analytics: { title: string; description: string };
    bioPages: { title: string; description: string };
    qrStyles: { title: string; description: string };
    edge: { title: string; description: string };
  };
  pricing: {
    title: string; subtitle: string;
    free: { name: string; features: string[] };
    pro: { name: string; features: string[] };
    elite: { name: string; features: string[] };
    platinum: { name: string; features: string[] };
    period: string; getStarted: string; subscribe: string; popular: string;
  };
  sponsors: { label: string; title: string; description: string; cta: string; ctaSub: string };
  authModal: { title: string; description: string; google: string; github: string; terms: string; termsLink: string };
  auth: {
    title: string; subtitle: string; googleBtn: string; githubBtn: string; separator: string;
    emailPlaceholder: string; passwordPlaceholder: string; loginBtn: string; forgotPassword: string;
    noAccount: string; signUp: string; cantAccess: string; termsDisclaimer: string; backToHome: string;
    registerTitle: string; registerSubtitle: string; registerBtn: string; hasAccount: string; logIn: string;
    resetTitle: string; resetSubtitle: string; resetBtn: string; backToLogin: string;
  };
  langSelector: { id: string; en: string };
  terms: {
    title: string;
    lastUpdated: string;
    sections: { heading: string; content: string }[];
  };
  privacy: {
    title: string;
    lastUpdated: string;
    sections: { heading: string; content: string }[];
  };
}

export const en: Translations = {
  locale: "en",
  nav: {
    shortener: "Shortener",
    analytics: "Analytics",
    qrCodes: "QR Codes",
    microsite: "Microsite",
    pricing: "Pricing",
    loginRegister: "Login / Register",
    dashboard: "Dashboard",
  },
  hero: {
    headline: "Short Links, Big Impact.",
    subtitle: "Shorten, share, and track your links with the simplest URL shortener on the web.",
    trust: "Trusted by 10,000+ creators & developers worldwide",
  },
  tabs: {
    shortener: "Shortener",
    qr: "QR Code",
    bio: "Bio Page",
  },
  shortener: {
    placeholder: "Paste your long URL here...",
    button: "Shorten URL",
    loading: "Shortening...",
    resultLabel: "Your short link",
    copy: "Copy",
    copied: "Copied!",
    error: "Please enter a URL.",
    networkError: "Network error. Please check your connection and try again.",
  },
  qr: {
    placeholder: "Enter URL or text to generate QR Code...",
    button: "Generate QR",
    download: "Download QR",
    error: "Please enter a URL or text.",
  },
  bio: {
    placeholder: "yourname",
    suffix: ".kliqs.me",
    button: "Create Bio Page",
    error: "Please enter a username.",
  },
  guestWarning: "This link/QR Code is temporary and will be deleted in 24 hours.",
  guestWarningCta: "Sign up or Login now",
  guestWarningEnd: "to make it permanent!",
  features: {
    title: "Built for Speed & Scale",
    subtitle: "Everything you need to manage, track, and grow your online presence.",
    analytics: { title: "Real-time Analytics", description: "Track clicks, geographic data, and referrers as they happen." },
    bioPages: { title: "Secure Bio Pages", description: "Create beautiful personal landing pages with SSL protection." },
    qrStyles: { title: "Custom QR Styles", description: "Generate branded QR codes with custom colors and logos." },
    edge: { title: "Global Edge Delivery", description: "Sub-50ms redirects powered by worldwide edge infrastructure." },
  },
  pricing: {
    title: "Simple, Transparent Pricing",
    subtitle: "Start free. Upgrade when you need more power.",
    free: { name: "Free", features: ["5 short links/day", "5 QR codes/month", "Basic analytics", "Community support"] },
    pro: { name: "Pro", features: ["Unlimited links", "Custom Bio Page", "Full analytics", "Priority support"] },
    elite: { name: "Elite", features: ["Everything in Pro", "API access", "Custom domains", "Team collaboration"] },
    platinum: { name: "Platinum", features: ["White-label", "Priority 24/7", "Unlimited everything", "SLA guarantee"] },
    period: "/mo",
    getStarted: "Get Started",
    subscribe: "Subscribe",
    popular: "Most Popular",
  },
  sponsors: {
    label: "SPONSORS",
    title: "Building Together a Sustainable Future for Kliqs",
    description: "Our sponsors help us keep Kliqs free and accessible for everyone. Their support enables us to maintain edge infrastructure and deliver the fastest URL shortener experience.",
    cta: "Become a Sponsor",
    ctaSub: "(Get visibility/mo)",
  },
  authModal: {
    title: "One more step!",
    description: "Login or register a Kliqs account to claim your subdomain",
    google: "Sign in with Google",
    github: "Sign in with GitHub",
    terms: "By signing in, you agree to our",
    termsLink: "Terms of Service",
  },
  langSelector: { id: "Bahasa Indonesia", en: "English" },
  auth: {
    title: "Log in",
    subtitle: "Sign in to manage your shortened links",
    googleBtn: "Continue with Google",
    githubBtn: "Continue with GitHub",
    separator: "or",
    emailPlaceholder: "Email address",
    passwordPlaceholder: "Password",
    loginBtn: "Log in",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    signUp: "Register",
    cantAccess: "Can't Access Your Account?",
    termsDisclaimer: "By signing in, you agree to our Terms of Service and Privacy Policy.",
    backToHome: "Back to homepage",
    registerTitle: "Create an account",
    registerSubtitle: "Get started with Kliqs for free",
    registerBtn: "Register",
    hasAccount: "Already have an account?",
    logIn: "Log in",
    resetTitle: "Reset your password",
    resetSubtitle: "Enter your email and we'll send you a reset link",
    resetBtn: "Send reset link",
    backToLogin: "Back to login",
  },
  terms: {
    title: "Terms of Service",
    lastUpdated: "Last updated: January 1, 2025",
    sections: [
      { heading: "1. Acceptance of Terms", content: "By accessing or using Kliqs.me (the \"Service\"), you agree to be bound by these Terms of Service. Kliqs.me is operated under the jurisdiction of the Republic of Indonesia and complies with Law No. 11 of 2008 concerning Electronic Information and Transactions (UU ITE) as amended by Law No. 19 of 2016. If you do not agree to these terms, you must discontinue use immediately." },
      { heading: "2. Description of Service", content: "Kliqs.me provides URL shortening, QR code generation, microsite/bio page hosting, and link analytics services. The Service is accessible to both anonymous guests and registered users, with certain advanced features restricted to authenticated accounts." },
      { heading: "3. User Accounts", content: "Accounts may be created via third-party OAuth providers (Google, GitHub). You are responsible for maintaining the confidentiality of your account and for all activities conducted through it. Links created by anonymous (guest) users are temporary and will be automatically purged after 24 hours. Registered users retain their links indefinitely unless they violate these Terms." },
      { heading: "4. Prohibited Use", content: "You are strictly prohibited from using the Service to: (a) create shortened URLs, QR codes, or microsites pointing to phishing, malware, or scam websites; (b) distribute content related to online gambling (judi online) in violation of Indonesian law; (c) host or redirect to pornographic, obscene, or sexually exploitative content; (d) impersonate another individual, organization, or government entity; (e) engage in spam distribution or deceptive link redirection; (f) infringe intellectual property rights of third parties; (g) violate any provision of UU ITE or other applicable Indonesian regulations. Any violation may result in immediate suspension or permanent deletion of your account and all associated links without prior notice." },
      { heading: "5. Account Suspension & Termination", content: "Kliqs.me reserves the right to immediately suspend or permanently terminate any account, and to disable or delete any link, QR code, or microsite, if we reasonably believe that the content violates these Terms, Indonesian law, or poses a risk to our users or infrastructure. No refund will be issued for paid subscriptions terminated due to violations." },
      { heading: "6. Payment Terms", content: "Paid subscription plans are billed monthly in Indonesian Rupiah (IDR). By subscribing, you authorize recurring charges to your selected payment method. All fees are non-refundable unless required by applicable law. You may cancel at any time; access continues until the end of the current billing period. We reserve the right to modify pricing with 30 days advance notice." },
      { heading: "7. Intellectual Property", content: "The Kliqs.me platform, including its name, logo, design, source code, and documentation, is the exclusive property of its operators. You retain ownership of content you create through the Service but grant us a limited, non-exclusive license to host and display it as necessary to provide the Service." },
      { heading: "8. Limitation of Liability", content: "To the fullest extent permitted by Indonesian law, Kliqs.me and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. The Service is provided on an \"as is\" and \"as available\" basis without warranties of any kind. Our total liability shall not exceed the amount you paid to us in the 12 months preceding the claim." },
      { heading: "9. Indemnification", content: "You agree to indemnify, defend, and hold harmless Kliqs.me and its operators from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Service, your content, or your violation of these Terms or applicable law." },
      { heading: "10. Governing Law & Dispute Resolution", content: "These Terms shall be governed by and construed in accordance with the laws of the Republic of Indonesia. Any disputes shall be resolved through deliberation and consensus (musyawarah mufakat). If no resolution is reached, disputes shall be submitted to the competent court in Jakarta, Indonesia." },
      { heading: "11. Amendments", content: "We may revise these Terms at any time by updating this page. Material changes will be communicated via email or in-app notification. Continued use of the Service after revisions take effect constitutes acceptance of the updated Terms." },
      { heading: "12. Contact", content: "For questions about these Terms, contact us at support@kliqs.me." },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: January 1, 2025",
    sections: [
      { heading: "1. Introduction", content: "This Privacy Policy explains how Kliqs.me collects, uses, stores, and protects your personal data. We comply with Law No. 27 of 2022 concerning Personal Data Protection (UU PDP) of the Republic of Indonesia." },
      { heading: "2. Data We Collect", content: "We collect the following categories of data: (a) Account Data — name, email address, and profile avatar provided by OAuth providers (Google, GitHub); (b) URLs & Content — original long URLs submitted for shortening, custom slugs, QR code data, and bio page content; (c) Analytics Data — IP addresses (used for geographic routing and click analytics), referrer URLs, browser/user-agent strings, device type, and timestamps; (d) Technical Data — server logs including IP address, browser type, operating system, and session duration." },
      { heading: "3. How We Use Your Data", content: "We use collected data to: provide and maintain the URL shortening, QR code, and analytics services; authenticate your identity via OAuth; generate click statistics and geographic reports; detect and prevent abuse, spam, phishing, and security threats; communicate important service updates; comply with legal obligations under Indonesian law; and improve platform performance." },
      { heading: "4. Data Retention", content: "Guest (anonymous) links and associated click data are automatically deleted after 24 hours. Registered user data is retained for the lifetime of the account and deleted within 30 days of an account deletion request. Raw analytics data is retained for 12 months; aggregated anonymized statistics may be retained indefinitely. Server logs are retained for 90 days." },
      { heading: "5. Cookies & Tracking", content: "We use essential cookies for authentication and session management (cannot be disabled). Analytics cookies help us understand usage patterns in anonymized form. You can manage cookie preferences through your browser settings, but disabling essential cookies may prevent access to authenticated features." },
      { heading: "6. Data Sharing", content: "We do not sell your personal data. We may share data with: infrastructure providers (cloud hosting, CDN) for service delivery; authentication providers (Google, GitHub) for login; security services for fraud prevention; and legal authorities when required by valid legal process under Indonesian law." },
      { heading: "7. Data Security", content: "We implement industry-standard security measures including TLS/SSL encryption for all data in transit, encrypted storage for sensitive credentials, regular security audits, access controls with the principle of least privilege, and automated threat monitoring. However, no system is 100% secure." },
      { heading: "8. Your Rights Under UU PDP", content: "Under Indonesian Personal Data Protection Law (UU PDP), you have the right to: (a) access the personal data we hold about you; (b) rectify inaccurate or incomplete data; (c) request deletion of your personal data and account; (d) restrict or object to processing of your data; (e) obtain your data in a portable format; (f) withdraw consent at any time. To exercise these rights, contact support@kliqs.me. We will respond within 3x24 hours." },
      { heading: "9. International Data Transfers", content: "Our servers are located in Southeast Asia. If you access the Service from outside Indonesia, your data may be transferred to and processed in a different jurisdiction. By using the Service, you consent to such transfers in accordance with UU PDP requirements." },
      { heading: "10. Children's Privacy", content: "Kliqs.me is not directed at children under 17 years of age (in accordance with Indonesian law). We do not knowingly collect personal data from minors. If we discover that a minor has provided personal data, we will delete it promptly." },
      { heading: "11. Changes to This Policy", content: "We may update this Privacy Policy periodically. Material changes will be announced via email or in-app notification. The effective date at the top indicates when the latest revision took effect. Continued use constitutes acceptance." },
      { heading: "12. Contact & Data Protection Officer", content: "For questions, concerns, or data requests related to this Privacy Policy, contact our team at support@kliqs.me." },
    ],
  },
};
