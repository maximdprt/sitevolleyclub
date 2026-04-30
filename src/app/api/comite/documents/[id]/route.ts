import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { validateCsrfRequest } from "@/lib/security";

function canAccess(role?: string) {
  return role === "COMITE_DIRECTION" || role === "ADMIN";
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await validateCsrfRequest(_req))) {
    return NextResponse.json({ error: "Requête CSRF invalide." }, { status: 403 });
  }
  const session = await auth();
  if (!session?.user?.id || !canAccess(session.user.role)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const { id } = await params;
  const doc = await db.comiteDocument.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ error: "Document introuvable." }, { status: 404 });

  const canDelete = session.user.role === "ADMIN" || doc.uploadedBy === session.user.id;
  if (!canDelete) {
    return NextResponse.json({ error: "Suppression non autorisée." }, { status: 403 });
  }

  await db.comiteDocument.delete({ where: { id } });
  createAuditLog({
    userId: session.user.id,
    action: "DOCUMENT_DELETE",
    resource: `comite-document:${id}`,
  }).catch(console.error);
  return NextResponse.json({ ok: true });
}
