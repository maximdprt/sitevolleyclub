"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Props {
  resource: "posts" | "comments";
  id: string;
  initialContent: string;
  canEdit: boolean;
  canDelete: boolean;
}

export function InlineMessageActions({ resource, id, initialContent, canEdit, canDelete }: Props) {
  const [loading, setLoading] = useState(false);

  async function editItem() {
    const next = window.prompt("Modifier le message", initialContent);
    if (!next || next.trim().length < 5) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/forum/${resource}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resource === "posts" ? { content: next.trim() } : { content: next.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur modification");
      window.location.reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem() {
    if (!window.confirm("Supprimer cet élément ?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/forum/${resource}/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur suppression");
      window.location.reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2 flex justify-end gap-2 text-xs">
      {canEdit ? (
        <button type="button" disabled={loading} onClick={editItem} className="text-[#94a3b8] hover:text-white">
          Modifier
        </button>
      ) : null}
      {canDelete ? (
        <button type="button" disabled={loading} onClick={deleteItem} className="text-red-300 hover:text-red-200">
          Supprimer
        </button>
      ) : null}
    </div>
  );
}
