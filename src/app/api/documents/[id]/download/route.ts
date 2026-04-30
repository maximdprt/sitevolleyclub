import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";

interface Params { params: Promise<{ id: string }> }

/**
 * Téléchargement sécurisé d'un document.
 * — Toujours via cette route (jamais de fichier public en /public)
 * — Vérifie l'authentification et les permissions avant de rediriger
 * — Force le téléchargement via Content-Disposition: attachment
 */
export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  const document = await db.document.findUnique({ where: { id } });

  if (!document) {
    return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
  }

  const isOwner = document.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  const isComite = ["COMITE_DIRECTION", "ADMIN"].includes(session.user.role);

  // Contrôle d'accès par visibilité
  const canAccess =
    isOwner ||
    isAdmin ||
    (document.visibility === "COMITE" && isComite) ||
    document.visibility === "PUBLIC";

  if (!canAccess) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  createAuditLog({
    userId: session.user.id,
    action: "DOCUMENT_DOWNLOAD",
    resource: `document:${document.id}`,
    metadata: { ownerId: document.userId, visibility: document.visibility },
  }).catch(console.error);

  // Redirection vers l'URL signée UploadThing avec l'entête de téléchargement
  const response = NextResponse.redirect(document.fileUrl);
  response.headers.set(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(document.fileName)}"`
  );
  return response;
}
