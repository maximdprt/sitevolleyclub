"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Send } from "lucide-react";
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

const postSchema = z.object({
  title: z.string().min(5, "5 caractères minimum").max(200),
  content: z.string().min(10, "10 caractères minimum"),
  categoryId: z.string().min(1, "Sélectionnez une catégorie"),
});

type PostData = z.infer<typeof postSchema>;

export default function NouveauPostPage() {
  return (
    <Suspense>
      <NouveauPostForm />
    </Suspense>
  );
}

function NouveauPostForm() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultCategory = params.get("category") ?? "";
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostData>({ resolver: zodResolver(postSchema) });

  useEffect(() => {
    fetch("/api/forum/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        if (defaultCategory) {
          const match = data.find((c: { slug: string }) => c.slug === defaultCategory);
          if (match) setValue("categoryId", match.id);
        }
      })
      .catch(() => toast.error("Impossible de charger les catégories."));
  }, [defaultCategory, setValue]);

  async function onSubmit(data: PostData) {
    try {
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Erreur serveur.");
      }

      const post = await res.json();
      toast.success("Post créé !");
      router.push(`/forum/${post.categorySlug ?? defaultCategory}/${post.slug}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/forum"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#f0f7ff]/40 transition-colors hover:bg-[#f0f7ff]/5 hover:text-[#f0f7ff]/70"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">
            Nouveau post
          </h1>
          <p className="mt-0.5 text-sm text-[#f0f7ff]/50">
            Partagez une discussion avec les autres adhérents.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label>Catégorie</Label>
          <Select onValueChange={(v) => setValue("categoryId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && <p className="text-xs text-red-400">{errors.categoryId.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            placeholder="Titre de votre post"
            error={errors.title?.message}
            {...register("title")}
          />
          {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="content">Contenu</Label>
          <Textarea
            id="content"
            placeholder="Rédigez votre message ici (Markdown supporté)…"
            rows={10}
            {...register("content")}
          />
          {errors.content && <p className="text-xs text-red-400">{errors.content.message}</p>}
          <p className="text-xs text-[#f0f7ff]/20">
            Vous pouvez utiliser la syntaxe Markdown : **gras**, *italique*, [lien](url)
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/forum">
            <Button type="button" variant="ghost">Annuler</Button>
          </Link>
          <Button type="submit" loading={isSubmitting}>
            <Send className="h-4 w-4" />
            {isSubmitting ? "Publication…" : "Publier"}
          </Button>
        </div>
      </form>
    </div>
  );
}
