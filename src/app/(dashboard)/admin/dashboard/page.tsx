import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, FileText, MessageSquare, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/?auth=1");
  if (session.user.role !== "ADMIN") redirect("/espace-membre");

  const [usersCount, pendingUsers, docsCount, postsCount] = await Promise.all([
    db.user.count({ where: { status: "ACTIVE" } }),
    db.user.count({ where: { status: "PENDING" } }),
    db.document.count(),
    db.forumPost.count(),
  ]);

  const nextMatch = await db.clubMatch.findFirst({
    where: { matchAt: { gte: new Date() } },
    orderBy: { matchAt: "asc" },
    include: { team: { select: { name: true } } },
  });

  const lastArticle = await db.article.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: { title: true, slug: true, publishedAt: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8610a]/10">
          <Shield className="h-5 w-5 text-[#e8610a]" />
        </div>
        <div>
          <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">Tableau de bord</h1>
          <p className="text-sm text-[#f0f7ff]/50">Vue d’ensemble — Lacanau Volley-Ball</p>
        </div>
      </div>

      {pendingUsers > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <p className="text-sm text-amber-200">
              <strong>{pendingUsers}</strong> inscription{pendingUsers > 1 ? "s" : ""} en attente de validation
            </p>
            <Button asChild size="sm" variant="secondary">
              <Link href="/admin/membres">
                Traiter <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard title="Adhérents actifs" value={usersCount} icon={Users} />
        <StatCard title="En attente" value={pendingUsers} icon={Users} warning />
        <StatCard title="Documents" value={docsCount} icon={FileText} />
        <StatCard title="Posts forum" value={postsCount} icon={MessageSquare} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Prochain match</CardTitle>
            <Link href="/admin/matchs" className="text-xs text-[#2b7fbf] hover:text-[#e8610a]">
              Gérer
            </Link>
          </CardHeader>
          <CardContent className="text-sm text-[#f0f7ff]/60">
            {nextMatch ? (
              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#e8610a]" />
                <div>
                  <p className="font-medium text-[#f0f7ff]/90">
                    {nextMatch.team.name} vs {nextMatch.opponent}
                  </p>
                  <p className="text-xs text-[#f0f7ff]/40">
                    {new Date(nextMatch.matchAt).toLocaleString("fr-FR")}
                    {nextMatch.isHome ? " · Domicile" : " · Extérieur"}
                  </p>
                </div>
              </div>
            ) : (
              <p>Aucun match à venir en base. Ajoutez-en dans « Matchs ».</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Dernier article</CardTitle>
            <Link href="/admin/articles" className="text-xs text-[#2b7fbf] hover:text-[#e8610a]">
              Gérer
            </Link>
          </CardHeader>
          <CardContent className="text-sm text-[#f0f7ff]/60">
            {lastArticle ? (
              <div>
                <p className="font-medium text-[#f0f7ff]/90">{lastArticle.title}</p>
                <p className="text-xs text-[#f0f7ff]/40">
                  Publié le{" "}
                  {lastArticle.publishedAt
                    ? new Date(lastArticle.publishedAt).toLocaleDateString("fr-FR")
                    : "—"}
                </p>
                <Link
                  href={`/actualites/${lastArticle.slug}`}
                  className="mt-2 inline-block text-xs text-[#2b7fbf] hover:underline"
                >
                  Voir sur le site
                </Link>
              </div>
            ) : (
              <p>Aucun article publié. Créez-en dans « Articles ».</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accès administrateur</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[#f0f7ff]/60">
          Compte <Badge variant="accent">ADMIN</Badge> — modules disponibles dans le menu latéral.
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  warning,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  warning?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-5">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            warning ? "bg-amber-500/10" : "bg-[#2b7fbf]/10"
          }`}
        >
          <Icon className={`h-5 w-5 ${warning ? "text-amber-400" : "text-[#2b7fbf]"}`} />
        </div>
        <div>
          <p className="text-xl font-semibold text-[#f0f7ff]">{value}</p>
          <p className="text-xs text-[#f0f7ff]/35">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
