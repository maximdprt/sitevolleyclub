import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { validateCsrfRequest } from "@/lib/security";

function canAccess(role?: string) {
  return role === "COMITE_DIRECTION" || role === "ADMIN";
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !canAccess(session.user.role)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const folders = await db.comiteFolder.findMany({
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { documents: true } },
    },
  });
  return NextResponse.json(folders);
}

export async function POST(req: Request) {
  if (!(await validateCsrfRequest(req))) {
    return NextResponse.json({ error: "Requête CSRF invalide." }, { status: 403 });
  }
  const session = await auth();
  if (!session?.user?.id || !canAccess(session.user.role)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const body = await req.json();
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const parentId = typeof body?.parentId === "string" && body.parentId ? body.parentId : null;

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Nom de dossier invalide." }, { status: 422 });
  }

  if (parentId) {
    const parent = await db.comiteFolder.findUnique({ where: { id: parentId }, select: { id: true } });
    if (!parent) {
      return NextResponse.json({ error: "Dossier parent introuvable." }, { status: 404 });
    }
  }

  const folder = await db.comiteFolder.create({
    data: { name, parentId, createdBy: session.user.id },
  });
  createAuditLog({
    userId: session.user.id,
    action: "COMITE_FOLDER_CREATE",
    resource: `comite-folder:${folder.id}`,
    metadata: { name, parentId },
  }).catch(console.error);
  return NextResponse.json(folder, { status: 201 });
}
