import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { categorySchema } from "@/lib/validators/forum";
import { slugify } from "@/lib/utils";
import { validateCsrfRequest } from "@/lib/security";
import { createAuditLog } from "@/lib/audit";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const categories = await db.forumCategory.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true, icon: true },
  });

  return NextResponse.json(categories);
}

function canModerate(role?: string) {
  return role === "ADMIN" || role === "COMITE_DIRECTION";
}

export async function POST(req: Request) {
  if (!(await validateCsrfRequest(req))) {
    return NextResponse.json({ error: "Requête CSRF invalide." }, { status: 403 });
  }
  const session = await auth();
  if (!session?.user?.id || !canModerate(session.user.role)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 422 });
  }

  const baseSlug = slugify(parsed.data.name);
  const exists = await db.forumCategory.count({ where: { slug: { startsWith: baseSlug } } });
  const slug = exists > 0 ? `${baseSlug}-${exists}` : baseSlug;

  const category = await db.forumCategory.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      icon: parsed.data.icon,
      color: parsed.data.color,
      order: parsed.data.order ?? 0,
    },
  });
  createAuditLog({
    userId: session.user.id,
    action: "FORUM_CATEGORY_MANAGE",
    resource: `forum-category:${category.id}`,
    metadata: { op: "create", name: category.name },
  }).catch(console.error);
  return NextResponse.json(category, { status: 201 });
}

export async function PATCH(req: Request) {
  if (!(await validateCsrfRequest(req))) {
    return NextResponse.json({ error: "Requête CSRF invalide." }, { status: 403 });
  }
  const session = await auth();
  if (!session?.user?.id || !canModerate(session.user.role)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const body = await req.json();
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "ID manquant." }, { status: 422 });

  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 422 });
  }

  const slug = slugify(parsed.data.name);
  const category = await db.forumCategory.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      icon: parsed.data.icon,
      color: parsed.data.color,
      order: parsed.data.order ?? 0,
    },
  });
  createAuditLog({
    userId: session.user.id,
    action: "FORUM_CATEGORY_MANAGE",
    resource: `forum-category:${category.id}`,
    metadata: { op: "update", name: category.name },
  }).catch(console.error);
  return NextResponse.json(category);
}

export async function DELETE(req: Request) {
  if (!(await validateCsrfRequest(req))) {
    return NextResponse.json({ error: "Requête CSRF invalide." }, { status: 403 });
  }
  const session = await auth();
  if (!session?.user?.id || !canModerate(session.user.role)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID manquant." }, { status: 422 });

  const postCount = await db.forumPost.count({ where: { categoryId: id } });
  if (postCount > 0) {
    return NextResponse.json({ error: "Catégorie non vide. Supprimez ou déplacez les sujets d’abord." }, { status: 409 });
  }
  createAuditLog({
    userId: session.user.id,
    action: "FORUM_CATEGORY_MANAGE",
    resource: `forum-category:${id}`,
    metadata: { op: "delete" },
  }).catch(console.error);
  await db.forumCategory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
