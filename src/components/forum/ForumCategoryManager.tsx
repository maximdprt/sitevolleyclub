"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Category = {
  id: string;
  name: string;
  description: string | null;
};

export function ForumCategoryManager({ categories }: { categories: Category[] }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  async function createCategory() {
    if (!name.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/forum/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur");
      window.location.reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function renameCategory(c: Category) {
    const nextName = window.prompt("Nouveau nom de catégorie", c.name);
    if (!nextName || nextName.trim().length < 2) return;
    const nextDesc = window.prompt("Description", c.description ?? "");
    setBusy(true);
    try {
      const res = await fetch("/api/forum/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, name: nextName.trim(), description: nextDesc ?? undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur");
      window.location.reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function deleteCategory(c: Category) {
    if (!window.confirm(`Supprimer la catégorie "${c.name}" ?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/forum/categories?id=${c.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur");
      window.location.reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-[#f0f7ff]/10 bg-[#1e293b] p-4">
      <h3 className="mb-3 text-sm font-semibold text-white">Gestion des catégories</h3>
      <div className="mb-4 grid gap-2 md:grid-cols-[1fr_1fr_auto]">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom catégorie" />
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <Button type="button" disabled={busy} onClick={createCategory}>Créer</Button>
      </div>
      <div className="space-y-2">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg bg-[#0f172a] px-3 py-2">
            <div>
              <p className="text-sm text-white">{c.name}</p>
              {c.description ? <p className="text-xs text-[#94a3b8]">{c.description}</p> : null}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => renameCategory(c)} disabled={busy}>Modifier</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => deleteCategory(c)} disabled={busy}>Supprimer</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
