"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, FileText, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/heic"];
const MAX_SIZE = 10 * 1024 * 1024;

const formSchema = z.object({
  title: z.string().min(3, "3 caractères minimum").max(100),
  type: z.enum(["PIECE_IDENTITE", "CERTIFICAT_MEDICAL", "FORMULAIRE_ADHESION", "JUSTIFICATIF_DOMICILE", "AUTRE"] as const),
  notes: z.string().max(500).optional(),
});

type FormData = z.infer<typeof formSchema>;

const DOC_TYPES = [
  { value: "PIECE_IDENTITE", label: "Pièce d\u2019identité" },
  { value: "CERTIFICAT_MEDICAL", label: "Certificat médical" },
  { value: "FORMULAIRE_ADHESION", label: "Formulaire d\u2019adhésion" },
  { value: "JUSTIFICATIF_DOMICILE", label: "Justificatif de domicile" },
  { value: "AUTRE", label: "Autre" },
];

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const handleFile = useCallback((f: File) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      toast.error("Format non accepté. Utilisez PDF, JPG, PNG ou HEIC.");
      return;
    }
    if (f.size > MAX_SIZE) {
      toast.error("Fichier trop lourd (max 10 Mo).");
      return;
    }
    setFile(f);
  }, []);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function onSubmit(data: FormData) {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier.");
      return;
    }
    setUploading(true);
    try {
      const body = JSON.stringify({
        ...data,
        visibility: "PRIVATE",
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size,
        mimeType: file.type,
      });

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Erreur serveur.");
      }

      toast.success("Document déposé avec succès !");
      router.push("/espace-adherent/documents");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur lors du dépôt.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/espace-adherent/documents"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#f0f7ff]/40 transition-colors hover:bg-[#f0f7ff]/5 hover:text-[#f0f7ff]/70"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">
            Déposer un document
          </h1>
          <p className="mt-0.5 text-sm text-[#f0f7ff]/50">
            Formats acceptés : PDF, JPG, PNG, HEIC · Max 10 Mo
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Zone de dépôt */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
            dragActive
              ? "border-[#e8610a] bg-[#e8610a]/5"
              : file
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-[#f0f7ff]/10 hover:border-[#f0f7ff]/20 hover:bg-[#f0f7ff]/2"
          }`}
        >
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#f0f7ff]/80">{file.name}</p>
                  <p className="mt-0.5 text-xs text-[#f0f7ff]/40">
                    {(file.size / 1024 / 1024).toFixed(2)} Mo
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Supprimer et choisir un autre fichier
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f7ff]/5">
                  <Upload className="h-6 w-6 text-[#f0f7ff]/30" />
                </div>
                <div>
                  <p className="text-sm text-[#f0f7ff]/60">
                    Glissez-déposez votre fichier ici
                  </p>
                  <p className="mt-1 text-xs text-[#f0f7ff]/30">
                    ou cliquez pour parcourir
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.heic"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>

        {/* Titre */}
        <div className="space-y-1.5">
          <Label htmlFor="title">Titre du document</Label>
          <Input
            id="title"
            placeholder="ex : Certificat médical 2025-2026"
            error={errors.title?.message}
            {...register("title")}
          />
          {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <Label>Type de document</Label>
          <Select onValueChange={(v) => setValue("type", v as FormData["type"])}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              {DOC_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-xs text-red-400">{errors.type.message}</p>}
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label htmlFor="notes">Notes (optionnel)</Label>
          <Textarea
            id="notes"
            placeholder="Informations complémentaires…"
            rows={3}
            {...register("notes")}
          />
        </div>

        <div className="flex gap-3">
          <Link href="/espace-adherent/documents">
            <Button type="button" variant="ghost">Annuler</Button>
          </Link>
          <Button type="submit" loading={uploading} disabled={!file}>
            {uploading ? "Envoi en cours…" : "Déposer le document"}
          </Button>
        </div>
      </form>
    </div>
  );
}
