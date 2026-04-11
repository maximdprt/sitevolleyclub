import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WEEKDAY_LABELS_FR } from "@/lib/admin-ui";
import { createTrainingSlotAction } from "../_actions";

export default async function AdminEntrainementsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/espace-membre");

  const [teams, slots] = await Promise.all([
    db.team.findMany({ orderBy: { name: "asc" } }),
    db.trainingSlot.findMany({
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      include: { team: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">Entraînements</h1>
        <p className="mt-1 text-sm text-[#f0f7ff]/50">Créneaux récurrents par équipe.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nouveau créneau</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTrainingSlotAction} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
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
              <Label htmlFor="dayOfWeek">Jour</Label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                required
                className="flex h-10 w-full rounded-xl border border-[#f0f7ff]/10 bg-[#1a3a5c]/60 px-3 text-sm text-[#f0f7ff]"
              >
                {WEEKDAY_LABELS_FR.map((label, i) => (
                  <option key={label} value={i}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Début</Label>
              <Input id="startTime" name="startTime" type="time" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Fin</Label>
              <Input id="endTime" name="endTime" type="time" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="location">Lieu</Label>
              <Input id="location" name="location" required placeholder="COSEC Lacanau" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="note">Note (optionnel)</Label>
              <Textarea id="note" name="note" rows={2} placeholder="Infos vestiaires, matériel…" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Ajouter le créneau</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Créneaux enregistrés</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {slots.length === 0 ? (
            <p className="text-sm text-[#f0f7ff]/45">Aucun créneau.</p>
          ) : (
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase text-[#f0f7ff]/40">
                <tr>
                  <th className="pb-2 pr-4">Équipe</th>
                  <th className="pb-2 pr-4">Jour</th>
                  <th className="pb-2 pr-4">Horaires</th>
                  <th className="pb-2">Lieu</th>
                </tr>
              </thead>
              <tbody className="text-[#f0f7ff]/75">
                {slots.map((s) => (
                  <tr key={s.id} className="border-t border-[#f0f7ff]/8">
                    <td className="py-2 pr-4">{s.team.name}</td>
                    <td className="py-2 pr-4">{WEEKDAY_LABELS_FR[s.dayOfWeek] ?? s.dayOfWeek}</td>
                    <td className="py-2 pr-4">
                      {s.startTime} — {s.endTime}
                    </td>
                    <td className="py-2">{s.location}</td>
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
