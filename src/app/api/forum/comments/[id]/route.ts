import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { updateCommentSchema } from "@/lib/validators/forum";
import { createAuditLog } from "@/lib/audit";
import { validateCsrfRequest } from "@/lib/security";
import { sanitizeForumContent } from "@/lib/forum-security";

function canModerate(role?: string) {
  return role === "ADMIN" || role === "COMITE_DIRECTION";
}

function canEditOwn(createdAt: Date) {
  return Date.now() - createdAt.getTime() <= 30 * 60 * 1000;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await validateCsrfRequest(req))) {
    return NextResponse.json({ error: "Requête CSRF invalide." }, { status: 403 });
  }
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  const { id } = await params;

  const comment = await db.forumComment.findUnique({ where: { id } });
  if (!comment) return NextResponse.json({ error: "Commentaire introuvable." }, { status: 404 });

  const isOwner = comment.authorId === session.user.id;
  if (!isOwner || !canEditOwn(comment.createdAt)) {
    return NextResponse.json({ error: "Modification non autorisée." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = updateCommentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 422 });

  const updated = await db.forumComment.update({
    where: { id },
    data: { content: sanitizeForumContent(parsed.data.content), editedAt: new Date() },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await validateCsrfRequest(_req))) {
    return NextResponse.json({ error: "Requête CSRF invalide." }, { status: 403 });
  }
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  const { id } = await params;

  const comment = await db.forumComment.findUnique({ where: { id } });
  if (!comment) return NextResponse.json({ error: "Commentaire introuvable." }, { status: 404 });

  const isOwner = comment.authorId === session.user.id && canEditOwn(comment.createdAt);
  if (!isOwner && !canModerate(session.user.role)) {
    return NextResponse.json({ error: "Suppression non autorisée." }, { status: 403 });
  }

  await db.forumComment.delete({ where: { id } });
  createAuditLog({
    userId: session.user.id,
    action: "FORUM_COMMENT_DELETE",
    resource: `comment:${id}`,
  }).catch(console.error);
  return NextResponse.json({ ok: true });
}
