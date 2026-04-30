import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { moderatePostSchema, updatePostSchema } from "@/lib/validators/forum";
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

  const post = await db.forumPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Sujet introuvable." }, { status: 404 });

  const body = await req.json();
  if (body?.mode === "moderate") {
    if (!canModerate(session.user.role)) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }
    const parsed = moderatePostSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 422 });
    const updated = await db.forumPost.update({
      where: { id },
      data: { pinned: parsed.data.pinned ?? post.pinned, locked: parsed.data.locked ?? post.locked },
    });
    createAuditLog({
      userId: session.user.id,
      action: "FORUM_POST_MODERATE",
      resource: `post:${id}`,
      metadata: { pinned: updated.pinned, locked: updated.locked },
    }).catch(console.error);
    return NextResponse.json(updated);
  }

  const isOwner = post.authorId === session.user.id;
  if (!isOwner || !canEditOwn(post.createdAt)) {
    return NextResponse.json({ error: "Modification non autorisée." }, { status: 403 });
  }
  const parsed = updatePostSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 422 });
  const updated = await db.forumPost.update({
    where: { id },
    data: {
      title: parsed.data.title ?? post.title,
      content: parsed.data.content ? sanitizeForumContent(parsed.data.content) : post.content,
      editedAt: new Date(),
    },
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

  const post = await db.forumPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Sujet introuvable." }, { status: 404 });

  const isOwner = post.authorId === session.user.id && canEditOwn(post.createdAt);
  if (!isOwner && !canModerate(session.user.role)) {
    return NextResponse.json({ error: "Suppression non autorisée." }, { status: 403 });
  }

  await db.forumPost.delete({ where: { id } });
  createAuditLog({
    userId: session.user.id,
    action: "FORUM_POST_DELETE",
    resource: `post:${id}`,
  }).catch(console.error);

  return NextResponse.json({ ok: true });
}
