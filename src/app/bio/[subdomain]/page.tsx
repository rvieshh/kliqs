import { prisma } from "@/lib/prisma";
import { Globe, ExternalLink, Link2Off } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Public Bio Page — Rendered at [username].kliqs.me
// Server Component: fetches bio page data from DB based on subdomain param.
// Shows a custom "not found" UI if the subdomain doesn't exist.
// ─────────────────────────────────────────────────────────────────────────────

export default async function PublicBioPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  // Fetch bio page by handle (subdomain)
  const bioPage = await prisma.bioPage.findUnique({
    where: { handle: subdomain },
    include: {
      user: {
        select: { name: true, email: true, image: true },
      },
    },
  });

  // Custom "Not Found" UI — shown when subdomain doesn't exist or page is unpublished
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

  const userName = bioPage.user?.name || bioPage.title;
  const userEmail = bioPage.user?.email || "";

  // Generate gravatar for avatar
  let avatarUrl = bioPage.user?.image || "";
  if (!avatarUrl && userEmail) {
    const { createHash } = await import("crypto");
    const hash = createHash("md5").update(userEmail.trim().toLowerCase()).digest("hex");
    avatarUrl = `https://www.gravatar.com/avatar/${hash}?d=retro&s=200`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Profile Card */}
        <div className="text-center mb-8">
          {/* Avatar */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-[#4361ee] to-[#7c3aed] flex items-center justify-center ring-4 ring-white shadow-lg">
              <span className="text-3xl font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Name */}
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{bioPage.title}</h1>

          {/* Handle */}
          <p className="text-sm text-[#4361ee] font-medium mb-3">
            @{bioPage.handle}
          </p>

          {/* Bio */}
          {bioPage.description && (
            <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
              {bioPage.description}
            </p>
          )}
        </div>

        {/* Links placeholder — future feature */}
        <div className="space-y-3">
          <a
            href={`https://kliqs.me`}
            className="flex items-center justify-between w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl hover:border-[#4361ee]/30 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-[#4361ee]" />
              <span className="text-sm font-medium text-gray-800">Visit Kliqs.me</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#4361ee] transition-colors" />
          </a>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a
            href="https://home.kliqs.me"
            className="inline-flex items-center gap-2 text-xs text-gray-300 hover:text-gray-500 transition-colors"
          >
            Powered by Kliqs.me
          </a>
        </div>
      </div>
    </div>
  );
}
