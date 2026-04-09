import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { uploadDocumentSchema } from "@/lib/validators/document";
import { createAuditLog } from "@/lib/audit";

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
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = uploadDocumentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 422 });
    }

    const { title, type, notes, fileUrl, fileName, fileSize, mimeType, visibility } = parsed.data;

    const document = await db.document.create({
      data: {
        userId: session.user.id,
        title,
        type,
        notes,
        fileUrl,
        // Le nom de fichier est stocké tel quel (déjà randomisé par UploadThing)
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
      metadata: { title, type },
    }).catch(console.error);

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("[DOCUMENT_POST]", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
