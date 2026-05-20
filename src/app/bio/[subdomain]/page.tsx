import { prisma } from "@/lib/prisma";
import { Globe, ExternalLink, Link2Off } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Public Bio Page V2.0 — Rendered at [username].kliqs.me
// Supports custom backgrounds, per-link thumbnails, and premium styling.
// ─────────────────────────────────────────────────────────────────────────────

export default async function PublicBioPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  const bioPage = await prisma.bioPage.findUnique({
    where: { handle: subdomain },
    include: {
      links: { orderBy: { order: "asc" } },
      user: { select: { name: true, email: true, image: true } },
    },
  });

  if (!bioPage || !bioPage.published) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <Link2Off className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">
            The bio page <span className="font-semibold text-gray-700">{subdomain}.kliqs.me</span> doesn&apos;t exist or hasn&apos;t been published yet.
          </p>
          <a href="https://home.kliqs.me" className="inline-flex items-center gap-2 px-5 py-3 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] transition-all">
            Create your own at Kliqs.me
          </a>
        </div>
      </div>
    );
  }

  // Increment views
  prisma.bioPage.update({ where: { id: bioPage.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const displayName = bioPage.displayName || bioPage.title;
  const userEmail = bioPage.user?.email || "";

  let avatarUrl = bioPage.avatarUrl || bioPage.user?.image || "";
  if (!avatarUrl && userEmail) {
    const { createHash } = await import("crypto");
    const hash = createHash("md5").update(userEmail.trim().toLowerCase()).digest("hex");
    avatarUrl = `https://www.gravatar.com/avatar/${hash}?d=retro&s=200`;
  }

  // Background styles
  const bgColor = bioPage.backgroundColor || "#0a0a0a";
  const hasBgImage = !!bioPage.backgroundImageUrl;

  // Theme colors
  const textColor = bioPage.textColor || "#f8fafc";
  const buttonBgColor = bioPage.buttonBgColor || "#1a1a1a";
  const buttonTextColor = bioPage.buttonTextColor || "#ffffff";
  const accentColor = bioPage.accentColor || "#4361ee";

  // Avatar border settings
  const avatarBorderEnabled = bioPage.avatarBorderEnabled ?? false;
  const avatarBorderColor = bioPage.avatarBorderColor || "#4361ee";
  const avatarBorderWidth = bioPage.avatarBorderWidth ?? 4;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative" style={{ backgroundColor: bgColor }}>
      {/* Background Image with overlay */}
      {hasBgImage && (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bioPage.backgroundImageUrl})` }} />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </>
      )}

      <div className="w-full max-w-md relative z-10">
        {/* Profile */}
        <div className="text-center mb-10">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-24 h-24 rounded-full mx-auto mb-5 shadow-2xl object-cover" style={{ border: avatarBorderEnabled ? `${avatarBorderWidth}px solid ${avatarBorderColor}` : 'none' }} />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center shadow-2xl" style={{ background: `linear-gradient(135deg, ${accentColor}, #7c3aed)`, border: avatarBorderEnabled ? `${avatarBorderWidth}px solid ${avatarBorderColor}` : 'none' }}>
              <span className="text-3xl font-bold text-white">{displayName.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <h1 className="text-2xl font-bold mb-1" style={{ color: textColor }}>{displayName}</h1>
          <p className="text-sm font-medium mb-3" style={{ color: accentColor }}>@{bioPage.handle}</p>
          {bioPage.description && (
            <p className="text-sm max-w-xs mx-auto leading-relaxed" style={{ color: `${textColor}99` }}>{bioPage.description}</p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {bioPage.links.length > 0 ? (
            bioPage.links.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all hover:opacity-90 hover:scale-[1.02]" style={{ backgroundColor: buttonBgColor, color: buttonTextColor, border: `1px solid ${accentColor}30` }}>
                {link.thumbnailUrl ? (
                  <img src={link.thumbnailUrl} alt={link.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accentColor}20` }}>
                    <Globe className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                )}
                <span className="text-sm font-medium flex-1">{link.title}</span>
                <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-50" />
              </a>
            ))
          ) : (
            <div className="text-center py-6"><p className="text-sm" style={{ color: `${textColor}60` }}>No links added yet.</p></div>
          )}
        </div>

        <div className="mt-12 text-center">
          <a href="https://home.kliqs.me" className="inline-flex items-center gap-2 text-xs transition-colors hover:opacity-80" style={{ color: `${textColor}40` }}>Powered by Kliqs.me</a>
        </div>
      </div>
    </div>
  );
}
