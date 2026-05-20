import { prisma } from "@/lib/prisma";
import { Globe, ExternalLink, Link2Off } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Public Bio Page — Rendered at [username].kliqs.me
// Server Component: fetches bio page + links from DB based on subdomain param.
// Shows custom "not found" UI if subdomain doesn't exist or page is unpublished.
// ─────────────────────────────────────────────────────────────────────────────

export default async function PublicBioPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  // Fetch bio page with associated links
  const bioPage = await prisma.bioPage.findUnique({
    where: { handle: subdomain },
    include: {
      links: { orderBy: { order: "asc" } },
      user: {
        select: { name: true, email: true, image: true },
      },
    },
  });

  // Custom "Not Found" UI
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
          <a
            href="https://home.kliqs.me"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] transition-all"
          >
            Create your own at Kliqs.me
          </a>
        </div>
      </div>
    );
  }

  // Increment views (fire-and-forget)
  prisma.bioPage.update({
    where: { id: bioPage.id },
    data: { views: { increment: 1 } },
  }).catch(() => {});

  // Determine display values
  const displayName = bioPage.displayName || bioPage.title;
  const userEmail = bioPage.user?.email || "";

  // Avatar: custom > user image > gravatar
  let avatarUrl = bioPage.avatarUrl || bioPage.user?.image || "";
  if (!avatarUrl && userEmail) {
    const { createHash } = await import("crypto");
    const hash = createHash("md5").update(userEmail.trim().toLowerCase()).digest("hex");
    avatarUrl = `https://www.gravatar.com/avatar/${hash}?d=retro&s=200`;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Profile Card */}
        <div className="text-center mb-10">
          {/* Avatar */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-24 h-24 rounded-full mx-auto mb-5 ring-4 ring-white/10 shadow-2xl object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-5 bg-gradient-to-br from-[#4361ee] to-[#7c3aed] flex items-center justify-center ring-4 ring-white/10 shadow-2xl">
              <span className="text-3xl font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Name */}
          <h1 className="text-2xl font-bold text-white mb-1">{displayName}</h1>

          {/* Handle */}
          <p className="text-sm text-[#4361ee] font-medium mb-3">
            @{bioPage.handle}
          </p>

          {/* Bio */}
          {bioPage.description && (
            <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">
              {bioPage.description}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {bioPage.links.length > 0 ? (
            bioPage.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-[#4361ee]/40 transition-all group backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#4361ee]" />
                  <span className="text-sm font-medium text-white">{link.title}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[#4361ee] transition-colors" />
              </a>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500">No links added yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a
            href="https://home.kliqs.me"
            className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Powered by Kliqs.me
          </a>
        </div>
      </div>
    </div>
  );
}
