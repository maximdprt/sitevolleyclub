"use client";

import { useState } from "react";
import { toast } from "sonner";

export function ForumModerationActions({
  postId,
  pinned,
  locked,
}: {
  postId: string;
  pinned: boolean;
  locked: boolean;
}) {
  const [busy, setBusy] = useState(false);

  async function moderate(next: { pinned?: boolean; locked?: boolean }) {
    setBusy(true);
    try {
      const res = await fetch(`/api/forum/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...next, mode: "moderate" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Action impossible");
      window.location.reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function deletePost() {
    if (!window.confirm("Supprimer ce sujet et toutes ses réponses ?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/forum/posts/${postId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Suppression impossible");
      window.location.assign("/forum");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 flex flex-wrap justify-end gap-2 text-xs">
      <button
        type="button"
        disabled={busy}
        onClick={() => moderate({ pinned: !pinned })}
        className="rounded border border-[#f0f7ff]/20 px-2 py-1 text-[#f0f7ff]/70 hover:text-white"
      >
        {pinned ? "Désépingler" : "Épingler"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => moderate({ locked: !locked })}
        className="rounded border border-[#f0f7ff]/20 px-2 py-1 text-[#f0f7ff]/70 hover:text-white"
      >
        {locked ? "Rouvrir" : "Fermer"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={deletePost}
        className="rounded border border-red-400/50 px-2 py-1 text-red-300 hover:text-red-200"
      >
        Supprimer sujet
      </button>
    </div>
  );
}
