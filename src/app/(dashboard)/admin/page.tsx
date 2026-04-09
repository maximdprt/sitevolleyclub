import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, FileText, MessageSquare } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/espace-adherent");

  const [usersCount, pendingUsers, docsCount, postsCount] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { status: "PENDING" } }),
    db.document.count(),
    db.forumPost.count(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8610a]/10">
          <Shield className="h-5 w-5 text-[#e8610a]" />
        </div>
        <div>
          <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">
            Espace Administrateur
          </h1>
          <p className="text-sm text-[#f0f7ff]/50">
            Vue globale de l'activité de l'espace adhérent.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard title="Utilisateurs" value={usersCount} icon={Users} />
        <StatCard title="En attente" value={pendingUsers} icon={Users} warning />
        <StatCard title="Documents" value={docsCount} icon={FileText} />
        <StatCard title="Posts forum" value={postsCount} icon={MessageSquare} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accès administrateur actif</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[#f0f7ff]/60">
          Vous êtes connecté avec un compte <Badge variant="accent">ADMIN</Badge>.
          Vous pouvez compléter cette section avec les outils de gestion
          (validation adhérents, modération, journal d'audit).
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
