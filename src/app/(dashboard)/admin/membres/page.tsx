import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  approveUserAction,
  assignTeamAction,
  createConvocationAction,
  suspendUserAction,
} from "../_actions";

export default async function AdminMembresPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/espace-membre");

  const [users, teams] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 80,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        teamId: true,
        team: { select: { name: true } },
        createdAt: true,
      },
    }),
    db.team.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">Membres</h1>
        <p className="mt-1 text-sm text-[#f0f7ff]/50">
          Validation des comptes, affectation d&apos;équipe, convocations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nouvelle convocation (par équipe)</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createConvocationAction} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="c-teamId">Équipe</Label>
              <select
                id="c-teamId"
                name="teamId"
                required
                className="flex h-10 w-full rounded-xl border border-[#f0f7ff]/10 bg-[#1a3a5c]/60 px-3 text-sm text-[#f0f7ff]"
              >
                <option value="">— Choisir —</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventAt">Date de l&apos;événement (optionnel)</Label>
              <Input id="eventAt" name="eventAt" type="datetime-local" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="c-title">Titre</Label>
              <Input id="c-title" name="title" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="c-content">Message</Label>
              <Textarea id="c-content" name="content" required rows={5} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Publier la convocation</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase text-[#f0f7ff]/40">
              <tr>
                <th className="pb-2 pr-3">Nom</th>
                <th className="pb-2 pr-3">Email</th>
                <th className="pb-2 pr-3">Rôle</th>
                <th className="pb-2 pr-3">Statut</th>
                <th className="pb-2 pr-3">Équipe</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[#f0f7ff]/75">
              {users.map((u) => (
                <tr key={u.id} className="border-t border-[#f0f7ff]/8 align-top">
                  <td className="py-3 pr-3">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="py-3 pr-3 text-xs break-all">{u.email}</td>
                  <td className="py-3 pr-3">
                    <Badge variant="ocean">{u.role}</Badge>
                  </td>
                  <td className="py-3 pr-3">
                    <Badge
                      variant={
                        u.status === "ACTIVE"
                          ? "success"
                          : u.status === "PENDING"
                            ? "warning"
                            : "destructive"
                      }
                    >
                      {u.status}
                    </Badge>
                  </td>
                  <td className="py-3 pr-3">
                    <form action={assignTeamAction} className="flex flex-col gap-2">
                      <input type="hidden" name="userId" value={u.id} />
                      <select
                        name="teamId"
                        defaultValue={u.teamId ?? "__none"}
                        className="max-w-[180px] rounded-lg border border-[#f0f7ff]/10 bg-[#1a3a5c]/60 px-2 py-1 text-xs text-[#f0f7ff]"
                      >
                        <option value="__none">— Aucune —</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <Button type="submit" size="sm" variant="outline" className="w-fit text-xs">
                        Mettre à jour
                      </Button>
                    </form>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-col gap-2">
                      {u.status === "PENDING" ? (
                        <form action={approveUserAction}>
                          <input type="hidden" name="userId" value={u.id} />
                          <Button type="submit" size="sm" variant="secondary">
                            Approuver
                          </Button>
                        </form>
                      ) : null}
                      {u.status === "ACTIVE" && u.role === "ADHERENT" ? (
                        <form action={suspendUserAction}>
                          <input type="hidden" name="userId" value={u.id} />
                          <Button type="submit" size="sm" variant="destructive">
                            Suspendre
                          </Button>
                        </form>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
