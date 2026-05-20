// ─────────────────────────────────────────────────────────────────────────────
// Translation Dictionaries — English (en) & Indonesian (id)
// ─────────────────────────────────────────────────────────────────────────────

export type Locale = "en" | "id";

export const dictionaries: Record<Locale, Record<string, string>> = {
  en: {
    // Sidebar
    "nav.dashboard": "Dashboard",
    "nav.analytics": "Analytics",
    "nav.links": "Links",
    "nav.qrCodes": "QR Codes",
    "nav.bioPage": "Bio Page",
    "nav.settings": "Settings",
    "nav.freePlan": "Free Plan",
    "nav.signOut": "Sign out",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Welcome back",
    "dashboard.upgradePlan": "Upgrade Plan",
    "dashboard.shortNewLink": "Short new Link",
    "dashboard.createQrCodes": "Create new QR Codes",
    "dashboard.createBioPage": "Create new Bio Page",
    "dashboard.totalClicks": "Total Clicks",
    "dashboard.uniqueVisitors": "Unique Visitors",
    "dashboard.qrCodeScans": "QR Code Scans",
    "dashboard.bioPageViews": "Bio Page Views",
    "dashboard.planTitle": "Basic features for personal use",
    "dashboard.linksPerDay": "shortened links per day",
    "dashboard.qrPerMonth": "QR codes per month",
    "dashboard.basicAnalytics": "Basic click analytics",
    "dashboard.upgradePro": "Upgrade to Pro",
    "dashboard.usageThisPeriod": "Usage This Period",
    "dashboard.linksCreatedToday": "Links created today",
    "dashboard.qrCodesThisMonth": "QR Codes this month",
    "dashboard.totalActiveLinks": "Total active links",

    // Analytics
    "analytics.title": "Analytics",
    "analytics.subtitle": "Detailed traffic insights",
    "analytics.clickGrowth": "Click Growth",
    "analytics.activeLinks": "Active Links",
    "analytics.clickAnalytics": "Click Analytics",
    "analytics.clicksLast7Days": "Clicks over the last 7 days",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Manage your account and billing",
    "settings.profile": "Profile",
    "settings.personalInfo": "Your personal information",
    "settings.name": "Name",
    "settings.email": "Email",
    "settings.emailNote": "Email is managed by your authentication provider and cannot be changed here.",
    "settings.memberSince": "Member Since",
    "settings.saveChanges": "Save Changes",
    "settings.saving": "Saving...",
    "settings.billing": "Billing & Plan",
    "settings.manageSubscription": "Manage your subscription",
    "settings.upgrade": "Upgrade",
    "settings.security": "Security",
    "settings.changePassword": "Change your password",
    "settings.currentPassword": "Current Password",
    "settings.newPassword": "New Password",
    "settings.confirmPassword": "Confirm New Password",
    "settings.updatePassword": "Update Password",
    "settings.setPassword": "Set Password",
    "settings.updating": "Updating...",
    "settings.oauthNote": "You signed in via OAuth and don't have a password yet. Set one below for additional security.",
    "settings.passwordMismatch": "Passwords do not match",
    "settings.profileUpdated": "Profile updated successfully!",

    // Links
    "links.title": "Shortened Links",
    "links.subtitle": "Manage and track all your shortened URLs",
    "links.createNew": "Create New Link",
    "links.noLinks": "No links yet",
    "links.noLinksDesc": "Create your first shortened link to start tracking clicks and sharing URLs effortlessly.",
    "links.createFirst": "Create Your First Link",

    // QR Codes
    "qr.title": "QR Codes",
    "qr.subtitle": "Generate branded QR codes with logo support",
    "qr.createNew": "Create QR Code",
    "qr.noQr": "No QR codes yet",
    "qr.noQrDesc": "Create branded QR codes with custom colors, logos, and real-time scan tracking.",
    "qr.createFirst": "Generate Your First QR Code",

    // Bio Page
    "bio.title": "Bio Pages",
    "bio.subtitle": "Create and manage your personal bio link pages",
    "bio.createNew": "Create Bio Page",
    "bio.noBio": "Create your Bio Page",
    "bio.noBioDesc": "Build a beautiful, customizable landing page that houses all your important links in one place.",
    "bio.createFirst": "Create Your First Bio Page",
    "bio.readyToPublish": "Ready to publish",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.save": "Save",
    "common.views": "views",
    "common.scans": "scans",
    "common.clicks": "clicks",
    "common.published": "Published",
    "common.draft": "Draft",

    // Language
    "lang.en": "English",
    "lang.id": "Indonesia",
  },

  id: {
    // Sidebar
    "nav.dashboard": "Dasbor",
    "nav.analytics": "Analitik",
    "nav.links": "Tautan",
    "nav.qrCodes": "Kode QR",
    "nav.bioPage": "Halaman Bio",
    "nav.settings": "Pengaturan",
    "nav.freePlan": "Paket Gratis",
    "nav.signOut": "Keluar",

    // Dashboard
    "dashboard.title": "Dasbor",
    "dashboard.welcome": "Selamat datang kembali",
    "dashboard.upgradePlan": "Tingkatkan Paket",
    "dashboard.shortNewLink": "Buat Tautan Baru",
    "dashboard.createQrCodes": "Buat Kode QR Baru",
    "dashboard.createBioPage": "Buat Halaman Bio Baru",
    "dashboard.totalClicks": "Total Klik",
    "dashboard.uniqueVisitors": "Pengunjung Unik",
    "dashboard.qrCodeScans": "Pemindaian Kode QR",
    "dashboard.bioPageViews": "Tampilan Halaman Bio",
    "dashboard.planTitle": "Fitur dasar untuk penggunaan pribadi",
    "dashboard.linksPerDay": "tautan pendek per hari",
    "dashboard.qrPerMonth": "kode QR per bulan",
    "dashboard.basicAnalytics": "Analitik klik dasar",
    "dashboard.upgradePro": "Tingkatkan ke Pro",
    "dashboard.usageThisPeriod": "Penggunaan Periode Ini",
    "dashboard.linksCreatedToday": "Tautan dibuat hari ini",
    "dashboard.qrCodesThisMonth": "Kode QR bulan ini",
    "dashboard.totalActiveLinks": "Total tautan aktif",

    // Analytics
    "analytics.title": "Analitik",
    "analytics.subtitle": "Wawasan lalu lintas terperinci",
    "analytics.clickGrowth": "Pertumbuhan Klik",
    "analytics.activeLinks": "Tautan Aktif",
    "analytics.clickAnalytics": "Analitik Klik",
    "analytics.clicksLast7Days": "Klik selama 7 hari terakhir",

    // Settings
    "settings.title": "Pengaturan",
    "settings.subtitle": "Kelola akun dan tagihan Anda",
    "settings.profile": "Profil",
    "settings.personalInfo": "Informasi pribadi Anda",
    "settings.name": "Nama",
    "settings.email": "Email",
    "settings.emailNote": "Email dikelola oleh penyedia autentikasi Anda dan tidak dapat diubah di sini.",
    "settings.memberSince": "Anggota Sejak",
    "settings.saveChanges": "Simpan Perubahan",
    "settings.saving": "Menyimpan...",
    "settings.billing": "Tagihan & Paket",
    "settings.manageSubscription": "Kelola langganan Anda",
    "settings.upgrade": "Tingkatkan",
    "settings.security": "Keamanan",
    "settings.changePassword": "Ubah kata sandi Anda",
    "settings.currentPassword": "Kata Sandi Saat Ini",
    "settings.newPassword": "Kata Sandi Baru",
    "settings.confirmPassword": "Konfirmasi Kata Sandi Baru",
    "settings.updatePassword": "Perbarui Kata Sandi",
    "settings.setPassword": "Atur Kata Sandi",
    "settings.updating": "Memperbarui...",
    "settings.oauthNote": "Anda masuk melalui OAuth dan belum memiliki kata sandi. Atur di bawah untuk keamanan tambahan.",
    "settings.passwordMismatch": "Kata sandi tidak cocok",
    "settings.profileUpdated": "Profil berhasil diperbarui!",

    // Links
    "links.title": "Tautan Pendek",
    "links.subtitle": "Kelola dan lacak semua URL pendek Anda",
    "links.createNew": "Buat Tautan Baru",
    "links.noLinks": "Belum ada tautan",
    "links.noLinksDesc": "Buat tautan pendek pertama Anda untuk mulai melacak klik dan membagikan URL dengan mudah.",
    "links.createFirst": "Buat Tautan Pertama Anda",

    // QR Codes
    "qr.title": "Kode QR",
    "qr.subtitle": "Buat kode QR bermerek dengan dukungan logo",
    "qr.createNew": "Buat Kode QR",
    "qr.noQr": "Belum ada kode QR",
    "qr.noQrDesc": "Buat kode QR bermerek dengan warna kustom, logo, dan pelacakan pemindaian real-time.",
    "qr.createFirst": "Buat Kode QR Pertama Anda",

    // Bio Page
    "bio.title": "Halaman Bio",
    "bio.subtitle": "Buat dan kelola halaman tautan bio pribadi Anda",
    "bio.createNew": "Buat Halaman Bio",
    "bio.noBio": "Buat Halaman Bio Anda",
    "bio.noBioDesc": "Bangun halaman arahan yang indah dan dapat disesuaikan yang menampung semua tautan penting Anda di satu tempat.",
    "bio.createFirst": "Buat Halaman Bio Pertama Anda",
    "bio.readyToPublish": "Siap dipublikasikan",

    // Common
    "common.loading": "Memuat...",
    "common.error": "Kesalahan",
    "common.success": "Berhasil",
    "common.cancel": "Batal",
    "common.delete": "Hapus",
    "common.edit": "Edit",
    "common.save": "Simpan",
    "common.views": "tampilan",
    "common.scans": "pemindaian",
    "common.clicks": "klik",
    "common.published": "Dipublikasikan",
    "common.draft": "Draf",

    // Language
    "lang.en": "English",
    "lang.id": "Indonesia",
  },
};
