import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createCommentSchema } from "@/lib/validators/forum";
import { getForumCommentRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { createAuditLog } from "@/lib/audit";
import { fr } from "@/lib/i18n/fr";
import { validateCsrfRequest } from "@/lib/security";
import { sanitizeForumContent } from "@/lib/forum-security";

export async function POST(req: Request) {
  if (!(await validateCsrfRequest(req))) {
    return NextResponse.json({ error: "Requête CSRF invalide." }, { status: 403 });
  }
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
    const safeContent = sanitizeForumContent(content);

    // Vérifier que le post existe et n'est pas verrouillé
    const post = await db.forumPost.findUnique({
      where: { id: postId },
      select: { locked: true },
    });
    if (!post) return NextResponse.json({ error: "Sujet introuvable." }, { status: 404 });
    if (post.locked) return NextResponse.json({ error: "Ce sujet est verrouillé." }, { status: 403 });

    const comment = await db.forumComment.create({
      data: { content: safeContent, postId, authorId: session.user.id },
    });

    const now = new Date();
    await db.forumPost.update({ where: { id: postId }, data: { lastReplyAt: now } });
    await db.forumReadStatus.upsert({
      where: { userId_threadId: { userId: session.user.id, threadId: postId } },
      update: { lastReadAt: now },
      create: { userId: session.user.id, threadId: postId },
    });

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
