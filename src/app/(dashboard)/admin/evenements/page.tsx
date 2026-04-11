import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClubEventAction } from "../_actions";

const EVENT_TYPES = [
  { value: "TOURNOI", label: "Tournoi" },
  { value: "SOIREE_CLUB", label: "Soirée club" },
  { value: "ASSEMBLEE_GENERALE", label: "Assemblée générale" },
  { value: "STAGE", label: "Stage" },
  { value: "AUTRE", label: "Autre" },
] as const;

export default async function AdminEvenementsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/espace-membre");

  const events = await db.clubEvent.findMany({
    orderBy: { startAt: "desc" },
    take: 30,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">Événements club</h1>
        <p className="mt-1 text-sm text-[#f0f7ff]/50">Tournois, AG, soirées… visibles côté adhérents.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nouvel événement</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createClubEventAction} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                required
                className="flex h-10 w-full rounded-xl border border-[#f0f7ff]/10 bg-[#1a3a5c]/60 px-3 text-sm text-[#f0f7ff]"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startAt">Date et heure</Label>
              <Input id="startAt" name="startAt" type="datetime-local" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image (URL)</Label>
              <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="externalUrl">Lien externe</Label>
              <Input id="externalUrl" name="externalUrl" type="url" placeholder="https://…" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Créer l&apos;événement</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Événements récents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {events.length === 0 ? (
            <p className="text-sm text-[#f0f7ff]/45">Aucun événement.</p>
          ) : (
            events.map((e) => (
              <div
                key={e.id}
                className="rounded-xl border border-[#f0f7ff]/8 px-4 py-3 text-sm text-[#f0f7ff]/75"
              >
                <p className="font-medium text-[#f0f7ff]">{e.title}</p>
                <p className="text-xs text-[#f0f7ff]/40">
                  {e.type.replaceAll("_", " ")} · {new Date(e.startAt).toLocaleString("fr-FR")}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
