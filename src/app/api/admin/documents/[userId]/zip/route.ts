import { NextResponse } from "next/server";
import JSZip from "jszip";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";

interface Params {
  params: Promise<{ userId: string }>;
}

function safeName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "_").trim();
}

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { userId } = await params;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      documents: {
        orderBy: { uploadedAt: "desc" },
        select: { id: true, fileName: true, fileUrl: true, type: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Adhérent introuvable." }, { status: 404 });
  }
  if (user.documents.length === 0) {
    return NextResponse.json({ error: "Aucun document à exporter." }, { status: 404 });
  }

  const zip = new JSZip();
  for (const doc of user.documents) {
    try {
      const response = await fetch(doc.fileUrl);
      if (!response.ok) continue;
      const bytes = await response.arrayBuffer();
      const prefixedName = `${doc.type}-${safeName(doc.fileName)}`;
      zip.file(prefixedName, bytes);
    } catch {
      // Skip unreadable files and continue zip generation.
    }
  }

  const content = await zip.generateAsync({ type: "uint8array" });
  const filename = `documents-${safeName(user.lastName)}-${safeName(user.firstName)}.zip`;
  createAuditLog({
    userId: session.user.id,
    action: "DOCUMENT_DOWNLOAD",
    resource: `documents-zip:${userId}`,
    metadata: { files: user.documents.length },
  }).catch(console.error);
  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
