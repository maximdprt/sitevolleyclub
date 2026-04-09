import { auth } from "@/auth";
import { db } from "@/lib/db";
import { FileText, Calendar, Shield, Mail, UserCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ROLE_LABELS: Record<string, string> = {
  ADHERENT: "Adhérent",
  COMITE_DIRECTION: "Comité de direction",
  ADMIN: "Administrateur",
};

const STATUS_LABELS: Record<string, { label: string; variant: "success" | "warning" | "destructive" }> = {
  ACTIVE: { label: "Actif", variant: "success" },
  PENDING: { label: "En attente", variant: "warning" },
  SUSPENDED: { label: "Suspendu", variant: "destructive" },
};

export default async function ProfilPage() {
  const session = await auth();
  const user = await db.user.findUniqueOrThrow({
    where: { id: session!.user.id },
    include: {
      _count: { select: { documents: true, forumPosts: true, forumComments: true } },
    },
  });

  const status = STATUS_LABELS[user.status] ?? { label: user.status, variant: "default" as const };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">Mon profil</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1a3a5c] text-lg font-bold text-[#f0f7ff]/70">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-semibold text-[#f0f7ff]">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-[#f0f7ff]/40">@{user.username}</p>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <InfoRow icon={Mail} label="Email" value={user.email} />
              <InfoRow icon={UserCircle} label="Nom d&apos;utilisateur" value={user.username} />
              <InfoRow
                icon={Shield}
                label="Rôle"
                value={ROLE_LABELS[user.role] ?? user.role}
              />
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0f7ff]/5">
                  <Calendar className="h-4 w-4 text-[#f0f7ff]/30" />
                </div>
                <div>
                  <p className="text-xs text-[#f0f7ff]/30">Statut</p>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <StatBlock value={user._count.documents} label="Documents" />
              <StatBlock value={user._count.forumPosts} label="Posts" />
              <StatBlock value={user._count.forumComments} label="Commentaires" />
            </div>
            <div className="mt-6 space-y-3">
              <InfoRow
                icon={Calendar}
                label="Membre depuis"
                value={new Date(user.createdAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
              {user.lastLoginAt && (
                <InfoRow
                  icon={Calendar}
                  label="Dernière connexion"
                  value={new Date(user.lastLoginAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0f7ff]/5">
        <Icon className="h-4 w-4 text-[#f0f7ff]/30" />
      </div>
      <div>
        <p className="text-xs text-[#f0f7ff]/30">{label}</p>
        <p className="text-sm text-[#f0f7ff]/80">{value}</p>
      </div>
    </div>
  );
}

function StatBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-[#f0f7ff]/3 border border-[#f0f7ff]/5 p-4 text-center">
      <p className="text-2xl font-bold text-[#f0f7ff]">{value}</p>
      <p className="mt-0.5 text-xs text-[#f0f7ff]/40">{label}</p>
    </div>
  );
}
