export interface Translations {
  locale: string;
  nav: {
    shortener: string;
    analytics: string;
    qrCodes: string;
    microsite: string;
    pricing: string;
    loginRegister: string;
    dashboard: string;
  };
  hero: {
    headline: string;
    subtitle: string;
    trust: string;
  };
  tabs: {
    shortener: string;
    qr: string;
    bio: string;
  };
  shortener: {
    placeholder: string;
    button: string;
    loading: string;
    resultLabel: string;
    copy: string;
    copied: string;
    error: string;
    networkError: string;
  };
  qr: {
    placeholder: string;
    button: string;
    download: string;
    error: string;
  };
  bio: {
    placeholder: string;
    suffix: string;
    button: string;
    error: string;
  };
  guestWarning: string;
  guestWarningCta: string;
  guestWarningEnd: string;
  features: {
    title: string;
    subtitle: string;
    analytics: { title: string; description: string };
    bioPages: { title: string; description: string };
    qrStyles: { title: string; description: string };
    edge: { title: string; description: string };
  };
  pricing: {
    title: string;
    subtitle: string;
    free: { name: string; features: string[] };
    pro: { name: string; features: string[] };
    elite: { name: string; features: string[] };
    platinum: { name: string; features: string[] };
    period: string;
    getStarted: string;
    subscribe: string;
    popular: string;
  };
  sponsors: {
    label: string;
    title: string;
    description: string;
    cta: string;
    ctaSub: string;
  };
  authModal: {
    title: string;
    description: string;
    google: string;
    github: string;
    terms: string;
    termsLink: string;
  };
  langSelector: {
    id: string;
    en: string;
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
    analytics: {
      title: "Real-time Analytics",
      description: "Track clicks, geographic data, and referrers as they happen.",
    },
    bioPages: {
      title: "Secure Bio Pages",
      description: "Create beautiful personal landing pages with SSL protection.",
    },
    qrStyles: {
      title: "Custom QR Styles",
      description: "Generate branded QR codes with custom colors and logos.",
    },
    edge: {
      title: "Global Edge Delivery",
      description: "Sub-50ms redirects powered by worldwide edge infrastructure.",
    },
  },
  pricing: {
    title: "Simple, Transparent Pricing",
    subtitle: "Start free. Upgrade when you need more power.",
    free: {
      name: "Free",
      features: ["5 short links/day", "5 QR codes/month", "Basic analytics", "Community support"],
    },
    pro: {
      name: "Pro",
      features: ["Unlimited links", "Custom Bio Page", "Full analytics", "Priority support"],
    },
    elite: {
      name: "Elite",
      features: ["Everything in Pro", "API access", "Custom domains", "Team collaboration"],
    },
    platinum: {
      name: "Platinum",
      features: ["White-label", "Priority 24/7", "Unlimited everything", "SLA guarantee"],
    },
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
  langSelector: {
    id: "Bahasa Indonesia",
    en: "English",
  },
};
