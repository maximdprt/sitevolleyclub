import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Download, Check, X, Archive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reviewDocumentAction } from "../_actions";
import { formatFileSize, relativeDate } from "@/lib/utils";

const REQUIRED_TYPES = [
  "PIECE_IDENTITE",
  "CERTIFICAT_MEDICAL",
  "FORMULAIRE_ADHESION",
  "PHOTO_IDENTITE",
] as const;

const STATUS_LABEL: Record<string, { label: string; variant: "warning" | "success" | "destructive" }> = {
  PENDING: { label: "En attente", variant: "warning" },
  APPROVED: { label: "Validé", variant: "success" },
  REJECTED: { label: "Refusé", variant: "destructive" },
};

const TYPE_LABEL: Record<string, string> = {
  PIECE_IDENTITE: "Pièce d’identité",
  CERTIFICAT_MEDICAL: "Certificat médical / QS-SPORT",
  FORMULAIRE_ADHESION: "Formulaire d’adhésion",
  PHOTO_IDENTITE: "Photo d’identité",
  JUSTIFICATIF_DOMICILE: "Justificatif de domicile",
  AUTRE: "Autre",
  COMITE_INTERNE: "Interne comité",
};

interface Props {
  searchParams: Promise<{ user?: string; status?: string; type?: string }>;
}

export default async function AdminDocumentsPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/espace-membre");

  const params = await searchParams;
  const selectedUserId = params.user;
  const statusFilter = params.status && ["PENDING", "APPROVED", "REJECTED"].includes(params.status) ? params.status : undefined;
  const typeFilter = params.type ?? undefined;

  const users = await db.user.findMany({
    where: { role: { in: ["ADHERENT", "COMITE_DIRECTION"] } },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      documents: {
        select: { type: true, status: true },
      },
    },
  });

  const selectedUser = users.find((u) => u.id === selectedUserId) ?? users[0] ?? null;

  const documents = selectedUser
    ? await db.document.findMany({
        where: {
          userId: selectedUser.id,
          ...(statusFilter ? { status: statusFilter as "PENDING" | "APPROVED" | "REJECTED" } : {}),
          ...(typeFilter ? { type: typeFilter as never } : {}),
        },
        orderBy: { uploadedAt: "desc" },
      })
    : [];

  const typeOptions = await db.document.findMany({
    select: { type: true },
    distinct: ["type"],
    orderBy: { type: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">Documents adhérents</h1>
          <p className="mt-1 text-sm text-[#f0f7ff]/50">Validation, refus et suivi de complétion des dossiers.</p>
        </div>
        {selectedUser ? (
          <Link href={`/api/admin/documents/${selectedUser.id}/zip`}>
            <Button variant="secondary">
              <Archive className="h-4 w-4" />
              Télécharger le ZIP
            </Button>
          </Link>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Adhérents ({users.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {users.map((u) => {
              const completed = REQUIRED_TYPES.filter((type) => u.documents.some((d) => d.type === type)).length;
              const pending = u.documents.filter((d) => d.status === "PENDING").length;
              return (
                <Link
                  key={u.id}
                  href={`/admin/documents?user=${u.id}`}
                  className={`block rounded-xl border px-3 py-2 transition ${
                    selectedUser?.id === u.id
                      ? "border-[#e8610a]/40 bg-[#e8610a]/10"
                      : "border-[#f0f7ff]/10 hover:bg-[#f0f7ff]/5"
                  }`}
                >
                  <div className="text-sm font-medium text-[#f0f7ff]">{u.firstName} {u.lastName}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[#f0f7ff]/50">
                    <span>{completed}/{REQUIRED_TYPES.length} documents</span>
                    {pending > 0 ? <Badge variant="warning">{pending} en attente</Badge> : null}
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : "Aucun adhérent"}
              </CardTitle>
            </div>
            {selectedUser ? (
              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/documents?user=${selectedUser.id}`}>
                  <Button size="sm" variant={!statusFilter ? "secondary" : "ghost"}>Tous statuts</Button>
                </Link>
                {["PENDING", "APPROVED", "REJECTED"].map((status) => (
                  <Link key={status} href={`/admin/documents?user=${selectedUser.id}&status=${status}${typeFilter ? `&type=${typeFilter}` : ""}`}>
                    <Button size="sm" variant={statusFilter === status ? "secondary" : "ghost"}>
                      {STATUS_LABEL[status].label}
                    </Button>
                  </Link>
                ))}
                {typeOptions.map((opt) => (
                  <Link
                    key={opt.type}
                    href={`/admin/documents?user=${selectedUser.id}${statusFilter ? `&status=${statusFilter}` : ""}&type=${opt.type}`}
                  >
                    <Button size="sm" variant={typeFilter === opt.type ? "secondary" : "ghost"}>
                      {TYPE_LABEL[opt.type] ?? opt.type}
                    </Button>
                  </Link>
                ))}
              </div>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-3">
            {!selectedUser ? (
              <p className="text-sm text-[#f0f7ff]/45">Aucun adhérent trouvé.</p>
            ) : documents.length === 0 ? (
              <p className="text-sm text-[#f0f7ff]/45">Aucun document pour ces filtres.</p>
            ) : (
              documents.map((doc) => {
                const st = STATUS_LABEL[doc.status];
                return (
                  <div key={doc.id} className="rounded-xl border border-[#f0f7ff]/10 bg-[#f0f7ff]/3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#2b7fbf]" />
                          <p className="text-sm font-medium text-[#f0f7ff]">{doc.title}</p>
                          <Badge variant={st.variant}>{st.label}</Badge>
                        </div>
                        <div className="mt-1 text-xs text-[#f0f7ff]/45">
                          {TYPE_LABEL[doc.type] ?? doc.type} · {doc.fileName} · {formatFileSize(doc.fileSize)} · {relativeDate(doc.uploadedAt)}
                        </div>
                        {doc.refusalReason ? (
                          <div className="mt-1 text-xs text-red-300">Motif refus: {doc.refusalReason}</div>
                        ) : null}
                      </div>
                      <Link href={`/api/documents/${doc.id}/download`}>
                        <Button size="icon" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <form action={reviewDocumentAction}>
                        <input type="hidden" name="documentId" value={doc.id} />
                        <input type="hidden" name="status" value="APPROVED" />
                        <Button size="sm" variant="secondary">
                          <Check className="h-4 w-4" />
                          Valider
                        </Button>
                      </form>
                      <form action={reviewDocumentAction} className="flex flex-wrap items-center gap-2">
                        <input type="hidden" name="documentId" value={doc.id} />
                        <input type="hidden" name="status" value="REJECTED" />
                        <Input
                          name="refusalReason"
                          placeholder="Motif de refus"
                          className="h-8 w-[220px]"
                        />
                        <Button size="sm" variant="ghost">
                          <X className="h-4 w-4" />
                          Refuser
                        </Button>
                      </form>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
