import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FileText, Download, Shield, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatFileSize, relativeDate } from "@/lib/utils";

export default async function ComiteDirectionPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== "COMITE_DIRECTION" && role !== "ADMIN") {
    redirect("/espace-membre");
  }

  const documents = await db.document.findMany({
    where: { visibility: "COMITE" },
    orderBy: { uploadedAt: "desc" },
    include: { user: { select: { firstName: true, lastName: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8610a]/10">
          <Shield className="h-5 w-5 text-[#e8610a]" />
        </div>
        <div>
          <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">
            Comité de Direction
          </h1>
          <p className="text-sm text-[#f0f7ff]/50">
            Documents internes réservés aux membres du comité.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-amber-300">
          <Lock className="h-4 w-4 shrink-0" />
          Cet espace est strictement confidentiel. Les documents partagés ici ne sont visibles que par les membres du comité et les administrateurs.
        </div>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Shield className="mx-auto h-12 w-12 text-[#f0f7ff]/10" />
            <h3 className="mt-4 text-lg font-semibold text-[#f0f7ff]/70">
              Aucun document interne
            </h3>
            <p className="mt-2 text-sm text-[#f0f7ff]/40">
              Les documents partagés par le comité apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <Card key={doc.id} className="transition-colors hover:bg-[#f0f7ff]/2">
              <CardContent className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8610a]/10">
                  <FileText className="h-5 w-5 text-[#e8610a]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#f0f7ff]/90">{doc.title}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-[#f0f7ff]/30">
                    <span>{doc.user.firstName} {doc.user.lastName}</span>
                    <span>·</span>
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span>·</span>
                    <span>{relativeDate(doc.uploadedAt)}</span>
                  </div>
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
          ))}
        </div>
      )}
    </div>
  );
}
