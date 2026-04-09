import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createPostSchema } from "@/lib/validators/forum";
import { slugify } from "@/lib/utils";
import { getForumPostRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { createAuditLog } from "@/lib/audit";
import { fr } from "@/lib/i18n/fr";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  // Rate limit : 1 post / 2 min par user
  const limiter = getForumPostRateLimiter();
  const { allowed, retryAfter } = await checkRateLimit(limiter, `post:${session.user.id}`);
  if (!allowed) {
    return NextResponse.json(
      { error: fr.forum.rateLimitPost, retryAfter },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 422 });
    }

    const { title, content, categoryId } = parsed.data;

    // Vérification que la catégorie existe
    const category = await db.forumCategory.findUnique({
      where: { id: categoryId },
      select: { id: true, slug: true },
    });
    if (!category) {
      return NextResponse.json({ error: "Catégorie introuvable." }, { status: 404 });
    }

    // Génération d'un slug unique
    const baseSlug = slugify(title);
    const existingCount = await db.forumPost.count({ where: { slug: { startsWith: baseSlug } } });
    const slug = existingCount > 0 ? `${baseSlug}-${existingCount}` : baseSlug;

    const post = await db.forumPost.create({
      data: { title, slug, content, authorId: session.user.id, categoryId },
    });

    createAuditLog({
      userId: session.user.id,
      action: "FORUM_POST_CREATE",
      resource: `post:${post.id}`,
      metadata: { title },
    }).catch(console.error);

    return NextResponse.json({ id: post.id, slug: post.slug, categorySlug: category.slug }, { status: 201 });
  } catch (error) {
    console.error("[FORUM_POST]", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
