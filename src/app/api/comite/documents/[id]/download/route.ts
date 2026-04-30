import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";

function canAccess(role?: string) {
  return role === "COMITE_DIRECTION" || role === "ADMIN";
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id || !canAccess(session.user.role)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const { id } = await params;
  const doc = await db.comiteDocument.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ error: "Document introuvable." }, { status: 404 });

  createAuditLog({
    userId: session.user.id,
    action: "DOCUMENT_DOWNLOAD",
    resource: `comite-document:${doc.id}`,
    metadata: { folderId: doc.folderId },
  }).catch(console.error);

  return NextResponse.redirect(doc.filePath);
}
