import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { FileText, Upload, MessageSquare, User, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { relativeDate } from "@/lib/utils";

const STATUS_BADGE = {
  PENDING: { label: "En attente", variant: "warning" as const },
  APPROVED: { label: "Approuvé", variant: "success" as const },
  REJECTED: { label: "Rejeté", variant: "destructive" as const },
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;
  const firstName = session!.user.name?.split(" ")[0] ?? "Adhérent";

  const [docStats, recentDocs, recentPosts] = await Promise.all([
    db.document.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    }),
    db.document.findMany({
      where: { userId },
      orderBy: { uploadedAt: "desc" },
      take: 4,
    }),
    db.forumPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        author: { select: { firstName: true, lastName: true } },
        category: { select: { name: true } },
        _count: { select: { comments: true } },
      },
    }),
  ]);

  const pending = docStats.find((d) => d.status === "PENDING")?._count.status ?? 0;
  const approved = docStats.find((d) => d.status === "APPROVED")?._count.status ?? 0;
  const rejected = docStats.find((d) => d.status === "REJECTED")?._count.status ?? 0;
  const total = pending + approved + rejected;

  const statCards = [
    { label: "Documents", value: total, icon: FileText, color: "text-[#2b7fbf]", bg: "bg-[#2b7fbf]/10" },
    { label: "En attente", value: pending, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Approuvés", value: approved, icon: FileText, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Forum", value: recentPosts.length, icon: MessageSquare, color: "text-[#e8610a]", bg: "bg-[#e8610a]/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Bienvenue */}
      <div>
        <h1 className="font-display text-3xl tracking-wide text-[#f0f7ff]">
          Bonjour, {firstName}
        </h1>
        <p className="mt-1 text-sm text-[#f0f7ff]/50">
          Bienvenue dans votre espace adhérent.
        </p>
      </div>

      {/* Actions rapides */}
      <div className="flex flex-wrap gap-3">
        <Link href="/espace-adherent/documents/upload">
          <Button size="sm">
            <Upload className="h-4 w-4" />
            Déposer un document
          </Button>
        </Link>
        <Link href="/forum/nouveau">
          <Button variant="secondary" size="sm">
            <MessageSquare className="h-4 w-4" />
            Nouveau post
          </Button>
        </Link>
        <Link href="/espace-adherent/profil">
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
            Mon profil
          </Button>
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#f0f7ff]">{s.value}</p>
                <p className="text-xs text-[#f0f7ff]/40">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Documents récents */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Documents récents</CardTitle>
          <Link href="/espace-adherent/documents" className="text-xs text-[#2b7fbf] hover:text-[#e8610a] transition-colors">
            Voir tous →
          </Link>
        </CardHeader>
        <CardContent>
          {recentDocs.length === 0 ? (
            <div className="py-8 text-center">
              <FileText className="mx-auto h-10 w-10 text-[#f0f7ff]/15" />
              <p className="mt-3 text-sm text-[#f0f7ff]/40">Aucun document déposé.</p>
              <Link href="/espace-adherent/documents/upload">
                <Button variant="outline" size="sm" className="mt-4">
                  Déposer votre premier document
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocs.map((doc) => {
                const st = STATUS_BADGE[doc.status];
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-xl border border-[#f0f7ff]/5 px-4 py-3 transition-colors hover:bg-[#f0f7ff]/2"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-[#f0f7ff]/30" />
                      <div>
                        <p className="text-sm font-medium text-[#f0f7ff]/80">{doc.title}</p>
                        <p className="text-xs text-[#f0f7ff]/30">{relativeDate(doc.uploadedAt)}</p>
                      </div>
                    </div>
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Posts récents du forum */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Dernières discussions</CardTitle>
          <Link href="/forum" className="text-xs text-[#2b7fbf] hover:text-[#e8610a] transition-colors">
            Voir le forum →
          </Link>
        </CardHeader>
        <CardContent>
          {recentPosts.length === 0 ? (
            <div className="py-8 text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-[#f0f7ff]/15" />
              <p className="mt-3 text-sm text-[#f0f7ff]/40">Aucune discussion pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/forum/${post.category.name.toLowerCase()}/${post.slug}`}
                  className="flex items-center justify-between rounded-xl border border-[#f0f7ff]/5 px-4 py-3 transition-colors hover:bg-[#f0f7ff]/2"
                >
                  <div>
                    <p className="text-sm font-medium text-[#f0f7ff]/80">{post.title}</p>
                    <p className="text-xs text-[#f0f7ff]/30">
                      {post.author.firstName} {post.author.lastName} · {relativeDate(post.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#f0f7ff]/30">
                      {post._count.comments} réponse{post._count.comments !== 1 ? "s" : ""}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#f0f7ff]/20" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
