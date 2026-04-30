"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FolderPlus, Upload, Search, Download, Trash2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUploadThing } from "@/utils/uploadthing";
import { formatFileSize, relativeDate } from "@/lib/utils";

type Folder = {
  id: string;
  name: string;
  parentId: string | null;
  _count?: { documents: number };
};

type ComiteDoc = {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  folder: { id: string; name: string };
  uploader: { id: string; firstName: string; lastName: string };
};

export function ComiteWorkspace({ currentUserId, currentRole }: { currentUserId: string; currentRole: string }) {
  const isAdmin = currentRole === "ADMIN";
  const { startUpload, isUploading } = useUploadThing("committeeDocument");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [docs, setDocs] = useState<ComiteDoc[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [newFolderName, setNewFolderName] = useState("");
  const [parentId, setParentId] = useState("__root");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("date");
  const [busy, setBusy] = useState(false);

  const selectedFolder = useMemo(
    () => folders.find((f) => f.id === selectedFolderId) ?? null,
    [folders, selectedFolderId],
  );

  async function loadFolders() {
    const res = await fetch("/api/comite/folders");
    if (!res.ok) throw new Error("Impossible de charger les dossiers.");
    const data = await res.json();
    setFolders(Array.isArray(data) ? data : []);
    if (!selectedFolderId && Array.isArray(data) && data.length > 0) {
      setSelectedFolderId(data[0].id);
    }
  }

  async function loadDocs(folderId: string, q: string, sortBy: string) {
    if (!folderId) {
      setDocs([]);
      return;
    }
    const qs = new URLSearchParams({ folderId, sort: sortBy, ...(q ? { q } : {}) });
    const res = await fetch(`/api/comite/documents?${qs.toString()}`);
    if (!res.ok) throw new Error("Impossible de charger les documents.");
    const data = await res.json();
    setDocs(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadFolders().catch((e) => toast.error(e instanceof Error ? e.message : "Erreur dossiers"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadDocs(selectedFolderId, query, sort).catch((e) => toast.error(e instanceof Error ? e.message : "Erreur documents"));
  }, [selectedFolderId, query, sort]);

  async function createFolder() {
    if (!newFolderName.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/comite/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFolderName.trim(),
          parentId: parentId === "__root" ? null : parentId,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur création dossier");
      setNewFolderName("");
      await loadFolders();
      toast.success("Dossier créé.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function uploadToFolder(file: File) {
    if (!selectedFolderId) {
      toast.error("Choisis d’abord un dossier.");
      return;
    }
    setBusy(true);
    try {
      const uploaded = await startUpload([file]);
      const first = uploaded?.[0];
      if (!first) throw new Error("Échec upload.");

      const res = await fetch("/api/comite/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folderId: selectedFolderId,
          filePath: first.url,
          fileName: first.name,
          fileSize: first.size,
          mimeType: first.type,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur enregistrement.");
      toast.success("Document ajouté.");
      await loadDocs(selectedFolderId, query, sort);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur upload");
    } finally {
      setBusy(false);
    }
  }

  async function deleteDoc(id: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/comite/documents/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur suppression");
      toast.success("Document supprimé.");
      await loadDocs(selectedFolderId, query, sort);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur suppression");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <div className="space-y-4 rounded-xl border border-[#f0f7ff]/10 bg-[#1e293b] p-4">
        <h3 className="text-sm font-semibold text-[#f0f7ff]">Dossiers</h3>
        <div className="space-y-2">
          {folders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              onClick={() => setSelectedFolderId(folder.id)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                selectedFolderId === folder.id ? "bg-[#f97316]/20 text-white" : "bg-[#0f172a] text-[#94a3b8] hover:bg-[#263246]"
              }`}
            >
              <span className="truncate">{folder.name}</span>
              <span className="text-xs opacity-80">{folder._count?.documents ?? 0}</span>
            </button>
          ))}
          {folders.length === 0 ? <p className="text-xs text-[#94a3b8]">Aucun dossier pour le moment.</p> : null}
        </div>

        <div className="space-y-2 border-t border-[#f0f7ff]/10 pt-3">
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Nom du dossier"
          />
          <Select value={parentId} onValueChange={setParentId}>
            <SelectTrigger>
              <SelectValue placeholder="Dossier parent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__root">Racine</SelectItem>
              {folders.map((f) => (
                <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={createFolder} disabled={busy}>
            <FolderPlus className="h-4 w-4" />
            Créer le dossier
          </Button>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-[#f0f7ff]/10 bg-[#1e293b] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[#f0f7ff]">
            {selectedFolder ? `Fichiers · ${selectedFolder.name}` : "Fichiers"}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-[#94a3b8]" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un fichier"
                className="w-56 pl-8"
              />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="size">Taille</SelectItem>
              </SelectContent>
            </Select>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#f97316] px-3 py-2 text-sm font-medium text-white hover:bg-[#ea580c]">
              <Upload className="h-4 w-4" />
              Upload
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadToFolder(file);
                  e.currentTarget.value = "";
                }}
              />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          {docs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#94a3b8]/40 bg-[#0f172a] p-8 text-center text-[#94a3b8]">
              <FolderOpen className="mx-auto mb-2 h-5 w-5" />
              Aucun fichier dans ce dossier.
            </div>
          ) : (
            docs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between gap-3 rounded-lg bg-[#0f172a] px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm text-white">{doc.fileName}</p>
                  <p className="text-xs text-[#94a3b8]">
                    {formatFileSize(doc.fileSize)} · {doc.uploader.firstName} {doc.uploader.lastName} · {relativeDate(doc.uploadedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`/api/comite/documents/${doc.id}/download`}>
                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </a>
                  {isAdmin || doc.uploadedBy === currentUserId ? (
                    <Button size="icon" variant="ghost" disabled={busy || isUploading} onClick={() => deleteDoc(doc.id)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
