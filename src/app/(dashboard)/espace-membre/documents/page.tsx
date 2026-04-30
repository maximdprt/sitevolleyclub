import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { FileText, Upload, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatFileSize, relativeDate } from "@/lib/utils";

const STATUS = {
  PENDING: { label: "En attente", variant: "warning" as const },
  APPROVED: { label: "Validé", variant: "success" as const },
  REJECTED: { label: "Refusé", variant: "destructive" as const },
};

const DOC_TYPE_LABEL: Record<string, string> = {
  PIECE_IDENTITE: "Pièce d\u2019identité",
  CERTIFICAT_MEDICAL: "Certificat médical",
  FORMULAIRE_ADHESION: "Formulaire d\u2019adhésion",
  PHOTO_IDENTITE: "Photo d’identité",
  JUSTIFICATIF_DOMICILE: "Justificatif de domicile",
  AUTRE: "Autre",
  COMITE_INTERNE: "Document comité",
};

export default async function DocumentsPage() {
  const session = await auth();
  const documents = await db.document.findMany({
    where: { userId: session!.user.id },
    orderBy: { uploadedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">Mes documents</h1>
          <p className="mt-1 text-sm text-[#f0f7ff]/50">
            {documents.length} document{documents.length !== 1 ? "s" : ""} déposé{documents.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/espace-membre/documents/upload">
          <Button size="sm">
            <Upload className="h-4 w-4" />
            Déposer
          </Button>
        </Link>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="mx-auto h-12 w-12 text-[#f0f7ff]/10" />
            <h3 className="mt-4 text-lg font-semibold text-[#f0f7ff]/70">Aucun document</h3>
            <p className="mt-2 text-sm text-[#f0f7ff]/40">
              Commencez par déposer vos documents administratifs (certificat médical, pièce d&apos;identité, etc.)
            </p>
            <Link href="/espace-membre/documents/upload">
              <Button className="mt-6">
                <Upload className="h-4 w-4" />
                Déposer mon premier document
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => {
            const st = STATUS[doc.status];
            return (
              <Card key={doc.id} className="transition-colors hover:bg-[#f0f7ff]/2">
                <CardContent className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2b7fbf]/10">
                    <FileText className="h-5 w-5 text-[#2b7fbf]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-[#f0f7ff]/90">{doc.title}</p>
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-[#f0f7ff]/30">
                      <span>{DOC_TYPE_LABEL[doc.type] ?? doc.type}</span>
                      <span>·</span>
                      <span className="max-w-[220px] truncate">{doc.fileName}</span>
                      <span>·</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>·</span>
                      <span>{relativeDate(doc.uploadedAt)}</span>
                    </div>
                    {(doc.refusalReason || doc.notes) && (
                      <p className="mt-1 text-xs italic text-[#f0f7ff]/25">
                        {doc.refusalReason ? `Motif: ${doc.refusalReason}` : doc.notes}
                      </p>
                    )}
                  </div>
                  <a
                    href={`/api/documents/${doc.id}/download`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#f0f7ff]/30 transition-colors hover:bg-[#f0f7ff]/5 hover:text-[#f0f7ff]/60"
                    aria-label="Télécharger"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
