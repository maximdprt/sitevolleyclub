import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { uploadDocumentSchema } from "@/lib/validators/document";
import { createAuditLog } from "@/lib/audit";
import { validateCsrfRequest } from "@/lib/security";

const SINGLE_INSTANCE_TYPES = new Set([
  "PIECE_IDENTITE",
  "CERTIFICAT_MEDICAL",
  "FORMULAIRE_ADHESION",
  "PHOTO_IDENTITE",
  "JUSTIFICATIF_DOMICILE",
]);

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const documents = await db.document.findMany({
    where: { userId: session.user.id },
    orderBy: { uploadedAt: "desc" },
  });

  return NextResponse.json(documents);
}

export async function POST(req: Request) {
  if (!(await validateCsrfRequest(req))) {
    return NextResponse.json({ error: "Requête CSRF invalide." }, { status: 403 });
  }
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = uploadDocumentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 422 });
    }

    const { title, type, notes, fileUrl, fileName, fileSize, mimeType, visibility } = parsed.data;
    const replaceExisting = body?.replaceExisting === true;

    const existing =
      SINGLE_INSTANCE_TYPES.has(type)
        ? await db.document.findFirst({
            where: { userId: session.user.id, type },
            orderBy: { uploadedAt: "desc" },
          })
        : null;

    if (existing && !replaceExisting) {
      return NextResponse.json(
        {
          error: "Un document de ce type existe déjà.",
          code: "DOCUMENT_TYPE_EXISTS",
          existing: {
            id: existing.id,
            title: existing.title,
            uploadedAt: existing.uploadedAt,
          },
        },
        { status: 409 },
      );
    }

    const document = existing
      ? await db.document.update({
          where: { id: existing.id },
          data: {
            title,
            type,
            notes,
            fileUrl,
            fileName,
            fileSize,
            mimeType,
            visibility: visibility ?? "PRIVATE",
            status: "PENDING",
            uploadedAt: new Date(),
            reviewedAt: null,
            reviewedBy: null,
            refusalReason: null,
          },
        })
      : await db.document.create({
          data: {
            userId: session.user.id,
            title,
            type,
            notes,
            fileUrl,
            fileName,
            fileSize,
            mimeType,
            visibility: visibility ?? "PRIVATE",
            status: "PENDING",
          },
        });

    createAuditLog({
      userId: session.user.id,
      action: "DOCUMENT_UPLOAD",
      resource: `document:${document.id}`,
      metadata: { title, type, replacedDocumentId: existing?.id ?? null },
    }).catch(console.error);

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("[DOCUMENT_POST]", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
