import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { FileText, Upload, MessageSquare, User, ArrowRight, Clock, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { relativeDate } from "@/lib/utils";
import { WEEKDAY_LABELS_FR } from "@/lib/admin-ui";
import { respondConvocationAction } from "./_actions";

const STATUS_BADGE = {
  PENDING: { label: "En attente", variant: "warning" as const },
  APPROVED: { label: "Approuvé", variant: "success" as const },
  REJECTED: { label: "Rejeté", variant: "destructive" as const },
};

const ATTENDANCE_LABEL: Record<string, string> = {
  YES: "Présent",
  NO: "Absent",
  MAYBE: "Peut-être",
};

export default async function EspaceMembrePage() {
  const session = await auth();
  const userId = session!.user.id;
  const firstName = session!.user.name?.split(" ")[0] ?? "Adhérent";

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      teamId: true,
      team: { select: { id: true, name: true } },
    },
  });
  const teamId = user?.teamId;

  const [
    docStats,
    recentDocs,
    recentPosts,
    upcomingMatches,
    trainingSlots,
    clubEvents,
    convocations,
    publicDocs,
  ] = await Promise.all([
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
        category: { select: { name: true, slug: true } },
        _count: { select: { comments: true } },
      },
    }),
    teamId
      ? db.clubMatch.findMany({
          where: { teamId, matchAt: { gte: new Date() } },
          orderBy: { matchAt: "asc" },
          take: 6,
          include: { team: { select: { name: true } } },
        })
      : Promise.resolve([]),
    teamId
      ? db.trainingSlot.findMany({
          where: { teamId },
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        })
      : Promise.resolve([]),
    db.clubEvent.findMany({
      where: { startAt: { gte: new Date() } },
      orderBy: { startAt: "asc" },
      take: 8,
    }),
    teamId
      ? db.convocation.findMany({
          where: { teamId },
          orderBy: { createdAt: "desc" },
          take: 8,
          include: {
            responses: { where: { userId }, select: { attendance: true } },
          },
        })
      : Promise.resolve([]),
    db.document.findMany({
      where: { visibility: "PUBLIC", status: "APPROVED" },
      orderBy: { uploadedAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        fileUrl: true,
        uploadedAt: true,
        fileName: true,
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
      <div>
        <h1 className="font-display text-3xl tracking-wide text-[#f0f7ff]">
          Bonjour, {firstName}
        </h1>
        <p className="mt-1 text-sm text-[#f0f7ff]/50">
          Bienvenue dans votre espace membre Lacanau Volley-Ball.
          {user?.team ? (
            <span className="ml-1 text-[#f0f7ff]/70">
              Équipe : <strong>{user.team.name}</strong>
            </span>
          ) : (
            <span className="ml-1 text-amber-200/80">
              Aucune équipe assignée pour le moment — contactez le club ou attendez la validation.
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/espace-membre/documents/upload">
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
        <Link href="/espace-membre/profil">
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
            Mon profil
          </Button>
        </Link>
      </div>

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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Prochains matchs</CardTitle>
            <Calendar className="h-4 w-4 text-[#f0f7ff]/25" />
          </CardHeader>
          <CardContent>
            {!teamId ? (
              <p className="text-sm text-[#f0f7ff]/45">
                Les matchs de votre équipe s&apos;affichent une fois une équipe vous est assignée.
              </p>
            ) : upcomingMatches.length === 0 ? (
              <p className="text-sm text-[#f0f7ff]/45">Aucun match à venir.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {upcomingMatches.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-xl border border-[#f0f7ff]/5 px-3 py-2 text-[#f0f7ff]/75"
                  >
                    <p className="font-medium text-[#f0f7ff]">
                      {m.team.name} vs {m.opponent}
                    </p>
                    <p className="text-xs text-[#f0f7ff]/40">
                      {new Date(m.matchAt).toLocaleString("fr-FR")} ·{" "}
                      {m.isHome ? "Domicile" : "Extérieur"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Entraînements</CardTitle>
            <MapPin className="h-4 w-4 text-[#f0f7ff]/25" />
          </CardHeader>
          <CardContent>
            {!teamId ? (
              <p className="text-sm text-[#f0f7ff]/45">Créneaux visibles après affectation d&apos;équipe.</p>
            ) : trainingSlots.length === 0 ? (
              <p className="text-sm text-[#f0f7ff]/45">Aucun créneau enregistré.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {trainingSlots.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-xl border border-[#f0f7ff]/5 px-3 py-2 text-[#f0f7ff]/75"
                  >
                    <p className="font-medium text-[#f0f7ff]">
                      {WEEKDAY_LABELS_FR[s.dayOfWeek] ?? `Jour ${s.dayOfWeek}`} · {s.startTime}–{s.endTime}
                    </p>
                    <p className="text-xs text-[#f0f7ff]/40">{s.location}</p>
                    {s.note ? <p className="mt-1 text-xs text-[#f0f7ff]/50">{s.note}</p> : null}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Événements du club</CardTitle>
        </CardHeader>
        <CardContent>
          {clubEvents.length === 0 ? (
            <p className="text-sm text-[#f0f7ff]/45">Aucun événement à venir.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {clubEvents.map((e) => (
                <li
                  key={e.id}
                  className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-[#f0f7ff]/5 px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-[#f0f7ff]">{e.title}</p>
                    <p className="text-xs text-[#f0f7ff]/40">
                      {new Date(e.startAt).toLocaleString("fr-FR")}
                    </p>
                    {e.description ? (
                      <p className="mt-1 text-xs text-[#f0f7ff]/55 line-clamp-2">{e.description}</p>
                    ) : null}
                  </div>
                  {e.externalUrl ? (
                    <a
                      href={e.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#2b7fbf] hover:underline"
                    >
                      Détails
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Convocations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!teamId ? (
            <p className="text-sm text-[#f0f7ff]/45">Réservé aux membres d&apos;une équipe.</p>
          ) : convocations.length === 0 ? (
            <p className="text-sm text-[#f0f7ff]/45">Aucune convocation.</p>
          ) : (
            convocations.map((c) => {
              const current = c.responses[0]?.attendance;
              return (
                <div
                  key={c.id}
                  className="rounded-xl border border-[#f0f7ff]/8 bg-[#f0f7ff]/3 px-4 py-3 text-sm"
                >
                  <p className="font-medium text-[#f0f7ff]">{c.title}</p>
                  {c.eventAt ? (
                    <p className="text-xs text-[#f0f7ff]/40">
                      {new Date(c.eventAt).toLocaleString("fr-FR")}
                    </p>
                  ) : null}
                  <p className="mt-2 whitespace-pre-wrap text-[#f0f7ff]/70">{c.content}</p>
                  <form action={respondConvocationAction} className="mt-3 flex flex-wrap items-end gap-2">
                    <input type="hidden" name="convocationId" value={c.id} />
                    <div className="space-y-1">
                      <label htmlFor={`att-${c.id}`} className="text-xs text-[#f0f7ff]/45">
                        Votre réponse
                      </label>
                      <select
                        id={`att-${c.id}`}
                        name="attendance"
                        defaultValue={current ?? "YES"}
                        className="flex h-9 rounded-lg border border-[#f0f7ff]/10 bg-[#1a3a5c]/60 px-2 text-xs text-[#f0f7ff]"
                      >
                        <option value="YES">Présent</option>
                        <option value="NO">Absent</option>
                        <option value="MAYBE">Peut-être</option>
                      </select>
                    </div>
                    <Button type="submit" size="sm" variant="secondary">
                      Enregistrer
                    </Button>
                    {current ? (
                      <Badge variant="ocean" className="ml-auto">
                        {ATTENDANCE_LABEL[current] ?? current}
                      </Badge>
                    ) : null}
                  </form>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Documents club (publics)</CardTitle>
        </CardHeader>
        <CardContent>
          {publicDocs.length === 0 ? (
            <p className="text-sm text-[#f0f7ff]/45">Aucun document public pour le moment.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {publicDocs.map((d) => (
                <li key={d.id}>
                  <a
                    href={d.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-2 rounded-lg border border-[#f0f7ff]/5 px-3 py-2 text-[#2b7fbf] hover:bg-[#f0f7ff]/5"
                  >
                    <span className="text-[#f0f7ff]/80">{d.title}</span>
                    <span className="text-xs text-[#f0f7ff]/35">{relativeDate(d.uploadedAt)}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Documents récents</CardTitle>
          <Link href="/espace-membre/documents" className="text-xs text-[#2b7fbf] hover:text-[#e8610a] transition-colors">
            Voir tous →
          </Link>
        </CardHeader>
        <CardContent>
          {recentDocs.length === 0 ? (
            <div className="py-8 text-center">
              <FileText className="mx-auto h-10 w-10 text-[#f0f7ff]/15" />
              <p className="mt-3 text-sm text-[#f0f7ff]/40">Aucun document déposé.</p>
              <Link href="/espace-membre/documents/upload">
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
                  href={`/forum/${post.category.slug}/${post.slug}`}
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
