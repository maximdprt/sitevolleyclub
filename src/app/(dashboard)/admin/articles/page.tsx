import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createArticleAction } from "../_actions";

export default async function AdminArticlesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/espace-membre");

  const articles = await db.article.findMany({
    orderBy: { updatedAt: "desc" },
    take: 25,
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">Articles</h1>
        <p className="mt-1 text-sm text-[#f0f7ff]/50">Actualités publiées sur /actualites.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nouvel article</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createArticleAction} className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta description (50–160 car.)</Label>
              <Textarea id="metaDescription" name="metaDescription" required rows={2} maxLength={160} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie (optionnel)</Label>
              <Input id="category" name="category" placeholder="Compétition, vie du club…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverImageUrl">Image de couverture (URL)</Label>
              <Input id="coverImageUrl" name="coverImageUrl" type="url" placeholder="https://…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea id="content" name="content" required rows={12} className="font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                name="status"
                className="flex h-10 w-full max-w-xs rounded-xl border border-[#f0f7ff]/10 bg-[#1a3a5c]/60 px-3 text-sm text-[#f0f7ff]"
              >
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publié</option>
              </select>
            </div>
            <Button type="submit" className="w-fit">
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Articles existants</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {articles.length === 0 ? (
            <p className="text-sm text-[#f0f7ff]/45">Aucun article.</p>
          ) : (
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="text-xs uppercase text-[#f0f7ff]/40">
                <tr>
                  <th className="pb-2 pr-4">Titre</th>
                  <th className="pb-2 pr-4">Statut</th>
                  <th className="pb-2">Lien public</th>
                </tr>
              </thead>
              <tbody className="text-[#f0f7ff]/75">
                {articles.map((a) => (
                  <tr key={a.id} className="border-t border-[#f0f7ff]/8">
                    <td className="py-2 pr-4">{a.title}</td>
                    <td className="py-2 pr-4">{a.status}</td>
                    <td className="py-2">
                      {a.status === "PUBLISHED" ? (
                        <Link
                          href={`/actualites/${a.slug}`}
                          className="text-[#2b7fbf] hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Voir
                        </Link>
                      ) : (
                        "—"
                      )}
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
