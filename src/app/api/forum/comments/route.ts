import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createCommentSchema } from "@/lib/validators/forum";
import { getForumCommentRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { createAuditLog } from "@/lib/audit";
import { fr } from "@/lib/i18n/fr";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  // Rate limit : 1 commentaire / 30s par user
  const limiter = getForumCommentRateLimiter();
  const { allowed, retryAfter } = await checkRateLimit(limiter, `comment:${session.user.id}`);
  if (!allowed) {
    return NextResponse.json(
      { error: fr.forum.rateLimitComment, retryAfter },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = createCommentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 422 });
    }

    const { content, postId } = parsed.data;

    // Vérifier que le post existe et n'est pas verrouillé
    const post = await db.forumPost.findUnique({
      where: { id: postId },
      select: { locked: true },
    });
    if (!post) return NextResponse.json({ error: "Sujet introuvable." }, { status: 404 });
    if (post.locked) return NextResponse.json({ error: "Ce sujet est verrouillé." }, { status: 403 });

    const comment = await db.forumComment.create({
      data: { content, postId, authorId: session.user.id },
    });

    // Mettre à jour updatedAt du post pour le tri
    await db.forumPost.update({ where: { id: postId }, data: { updatedAt: new Date() } });

    createAuditLog({
      userId: session.user.id,
      action: "FORUM_COMMENT_CREATE",
      resource: `comment:${comment.id}`,
    }).catch(console.error);

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("[FORUM_COMMENT]", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
