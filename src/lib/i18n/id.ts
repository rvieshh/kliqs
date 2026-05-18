import type { Translations } from "./en";

export const id: Translations = {
  locale: "id",
  nav: {
    shortener: "Shortener",
    analytics: "Analytics",
    qrCodes: "QR Codes",
    microsite: "Microsite",
    pricing: "Pricing",
    loginRegister: "Masuk / Daftar",
    dashboard: "Dashboard",
  },
  hero: {
    headline: "Satu Link Singkat, Engagement Auto Meningkat!",
    subtitle: "Pendekkan, bagikan, dan lacak tautan kamu dengan pemendek URL paling simpel di internet.",
    trust: "Dipercaya oleh 10.000+ kreator & developer di seluruh dunia",
  },
  tabs: {
    shortener: "Shortener",
    qr: "Kode QR",
    bio: "Bio Page",
  },
  shortener: {
    placeholder: "Tempel URL panjang kamu di sini...",
    button: "Pendekkan URL",
    loading: "Memproses...",
    resultLabel: "Link pendek kamu",
    copy: "Salin",
    copied: "Tersalin!",
    error: "Silakan masukkan URL.",
    networkError: "Kesalahan jaringan. Silakan periksa koneksi kamu dan coba lagi.",
  },
  qr: {
    placeholder: "Masukkan URL atau teks untuk membuat QR Code...",
    button: "Buat QR Code",
    download: "Unduh QR",
    error: "Silakan masukkan URL atau teks.",
  },
  bio: {
    placeholder: "namakamu",
    suffix: ".kliqs.me",
    button: "Buat Bio Page",
    error: "Silakan masukkan username.",
  },
  guestWarning: "Link / QR Code ini bersifat sementara dan akan dihapus dalam 24 jam.",
  guestWarningCta: "Daftar atau Login sekarang",
  guestWarningEnd: "agar permanen!",
  features: {
    title: "Dibangun untuk Kecepatan & Skala",
    subtitle: "Semua yang kamu butuhkan untuk mengelola, melacak, dan mengembangkan kehadiran online.",
    analytics: {
      title: "Analitik Real-time",
      description: "Lacak klik, data geografis, dan referrer secara langsung.",
    },
    bioPages: {
      title: "Bio Page Aman",
      description: "Buat halaman landing personal yang indah dengan perlindungan SSL.",
    },
    qrStyles: {
      title: "Gaya QR Kustom",
      description: "Buat kode QR bermerek dengan warna dan logo kustom.",
    },
    edge: {
      title: "Pengiriman Edge Global",
      description: "Redirect sub-50ms didukung oleh infrastruktur edge di seluruh dunia.",
    },
  },
  pricing: {
    title: "Harga Sederhana & Transparan",
    subtitle: "Mulai gratis. Upgrade saat butuh lebih banyak fitur.",
    free: {
      name: "Gratis",
      features: ["5 link pendek/hari", "5 QR code/bulan", "Analitik dasar", "Dukungan komunitas"],
    },
    pro: {
      name: "Pro",
      features: ["Link tak terbatas", "Bio Page kustom", "Analitik lengkap", "Dukungan prioritas"],
    },
    elite: {
      name: "Elite",
      features: ["Semua fitur Pro", "Akses API", "Domain kustom", "Kolaborasi tim"],
    },
    platinum: {
      name: "Platinum",
      features: ["White-label", "Prioritas 24/7", "Semua tak terbatas", "Garansi SLA"],
    },
    period: "/bln",
    getStarted: "Mulai Sekarang",
    subscribe: "Berlangganan",
    popular: "Paling Populer",
  },
  sponsors: {
    label: "SPONSOR",
    title: "Membangun Bersama Masa Depan Berkelanjutan untuk Kliqs",
    description: "Sponsor kami membantu menjaga Kliqs tetap gratis dan dapat diakses semua orang. Dukungan mereka memungkinkan kami memelihara infrastruktur edge dan menghadirkan pengalaman pemendek URL tercepat.",
    cta: "Jadi Sponsor",
    ctaSub: "(Dapatkan visibilitas/bln)",
  },
  authModal: {
    title: "Satu langkah lagi!",
    description: "Login atau daftar akun Kliqs dulu yuk untuk mengklaim subdomain",
    google: "Masuk dengan Google",
    github: "Masuk dengan GitHub",
    terms: "Dengan masuk, kamu setuju dengan",
    termsLink: "Ketentuan Layanan",
  },
  langSelector: {
    id: "Bahasa Indonesia",
    en: "English",
  },
};
