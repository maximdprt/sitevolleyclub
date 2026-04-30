import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { validateCsrfRequest } from "@/lib/security";

function canAccess(role?: string) {
  return role === "COMITE_DIRECTION" || role === "ADMIN";
}

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
]);

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !canAccess(session.user.role)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("folderId");
  const q = searchParams.get("q")?.trim() ?? "";
  const sort = searchParams.get("sort") ?? "date";

  const documents = await db.comiteDocument.findMany({
    where: {
      ...(folderId ? { folderId } : {}),
      ...(q
        ? {
            OR: [{ fileName: { contains: q, mode: "insensitive" } }],
          }
        : {}),
    },
    include: {
      folder: { select: { id: true, name: true } },
      uploader: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy:
      sort === "name"
        ? { fileName: "asc" }
        : sort === "size"
          ? { fileSize: "desc" }
          : { uploadedAt: "desc" },
  });

  return NextResponse.json(documents);
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
  const folderId = typeof body?.folderId === "string" ? body.folderId : "";
  const filePath = typeof body?.filePath === "string" ? body.filePath : "";
  const fileName = typeof body?.fileName === "string" ? body.fileName : "";
  const mimeType = typeof body?.mimeType === "string" ? body.mimeType : "";
  const fileSize = typeof body?.fileSize === "number" ? body.fileSize : 0;

  if (!folderId || !filePath || !fileName || !mimeType || !fileSize) {
    return NextResponse.json({ error: "Données invalides." }, { status: 422 });
  }
  if (fileSize > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Fichier trop volumineux (max 10 Mo)." }, { status: 422 });
  }
  if (!ALLOWED_MIME.has(mimeType)) {
    return NextResponse.json({ error: "Type de fichier non autorisé." }, { status: 422 });
  }

  const folder = await db.comiteFolder.findUnique({ where: { id: folderId }, select: { id: true } });
  if (!folder) {
    return NextResponse.json({ error: "Dossier introuvable." }, { status: 404 });
  }

  const doc = await db.comiteDocument.create({
    data: {
      folderId,
      filePath,
      fileName,
      fileSize,
      mimeType,
      uploadedBy: session.user.id,
    },
  });
  createAuditLog({
    userId: session.user.id,
    action: "DOCUMENT_UPLOAD",
    resource: `comite-document:${doc.id}`,
    metadata: { folderId, fileName },
  }).catch(console.error);

  return NextResponse.json(doc, { status: 201 });
}
