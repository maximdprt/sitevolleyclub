import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMatchAction } from "../_actions";

export default async function AdminMatchsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/espace-membre");

  const [teams, matches] = await Promise.all([
    db.team.findMany({ orderBy: { name: "asc" } }),
    db.clubMatch.findMany({
      orderBy: { matchAt: "desc" },
      take: 40,
      include: { team: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">Matchs</h1>
        <p className="mt-1 text-sm text-[#f0f7ff]/50">Créer des rencontres et publier les scores.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nouveau match</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createMatchAction} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="teamId">Équipe</Label>
              <select
                id="teamId"
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
              <Label htmlFor="opponent">Adversaire</Label>
              <Input id="opponent" name="opponent" required placeholder="Nom du club adverse" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="matchAt">Date et heure</Label>
              <Input id="matchAt" name="matchAt" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isHome">Lieu</Label>
              <select
                id="isHome"
                name="isHome"
                className="flex h-10 w-full rounded-xl border border-[#f0f7ff]/10 bg-[#1a3a5c]/60 px-3 text-sm text-[#f0f7ff]"
              >
                <option value="true">Domicile</option>
                <option value="false">Extérieur</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Salle / ville (optionnel)</Label>
              <Input id="location" name="location" placeholder="COSEC Lacanau…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="homeScore">Score domicile</Label>
              <Input id="homeScore" name="homeScore" type="number" min={0} placeholder="—" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="awayScore">Score extérieur</Label>
              <Input id="awayScore" name="awayScore" type="number" min={0} placeholder="—" />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                id="resultPublished"
                name="resultPublished"
                type="checkbox"
                className="h-4 w-4 rounded border-[#f0f7ff]/20"
              />
              <Label htmlFor="resultPublished" className="cursor-pointer font-normal">
                Publier le résultat sur les écrans adhérents
              </Label>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Enregistrer le match</Button>
            </div>
          </form>
          {teams.length === 0 ? (
            <p className="mt-4 text-sm text-amber-200/90">
              Aucune équipe en base : exécutez le seed Prisma ou créez des équipes via migration SQL /
              console.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Derniers matchs</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {matches.length === 0 ? (
            <p className="text-sm text-[#f0f7ff]/45">Aucun match enregistré.</p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase text-[#f0f7ff]/40">
                <tr>
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Équipe</th>
                  <th className="pb-2 pr-4">Rencontre</th>
                  <th className="pb-2 pr-4">Lieu</th>
                  <th className="pb-2">Score</th>
                </tr>
              </thead>
              <tbody className="text-[#f0f7ff]/75">
                {matches.map((m) => (
                  <tr key={m.id} className="border-t border-[#f0f7ff]/8">
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {new Date(m.matchAt).toLocaleString("fr-FR")}
                    </td>
                    <td className="py-2 pr-4">{m.team.name}</td>
                    <td className="py-2 pr-4">
                      vs {m.opponent}
                      {m.resultPublished ? (
                        <span className="ml-2 text-xs text-emerald-400">publié</span>
                      ) : null}
                    </td>
                    <td className="py-2 pr-4">{m.isHome ? "Domicile" : "Extérieur"}</td>
                    <td className="py-2">
                      {m.homeScore != null && m.awayScore != null
                        ? `${m.homeScore} — ${m.awayScore}`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
