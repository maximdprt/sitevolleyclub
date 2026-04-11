import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addGalleryImageAction, createGalleryAlbumAction } from "../_actions";

export default async function AdminGaleriePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/espace-membre");

  const albums = await db.galleryAlbum.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 12 },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">Galerie</h1>
        <p className="mt-1 text-sm text-[#f0f7ff]/50">Albums et images (URL hébergées, ex. UploadThing).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nouvel album</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createGalleryAlbumAction} className="grid max-w-xl gap-4">
            <div className="space-y-2">
              <Label htmlFor="album-title">Titre</Label>
              <Input id="album-title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="album-desc">Description</Label>
              <Textarea id="album-desc" name="description" rows={2} />
            </div>
            <Button type="submit" className="w-fit">
              Créer l&apos;album
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ajouter une image</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addGalleryImageAction} className="grid max-w-xl gap-4">
            <div className="space-y-2">
              <Label htmlFor="albumId">Album</Label>
              <select
                id="albumId"
                name="albumId"
                required
                className="flex h-10 w-full rounded-xl border border-[#f0f7ff]/10 bg-[#1a3a5c]/60 px-3 text-sm text-[#f0f7ff]"
              >
                <option value="">— Choisir —</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL de l&apos;image</Label>
              <Input id="url" name="url" type="url" required placeholder="https://…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt">Texte alternatif</Label>
              <Input id="alt" name="alt" required minLength={3} placeholder="Description pour l’accessibilité" />
            </div>
            <Button type="submit" className="w-fit">
              Ajouter
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {albums.length === 0 ? (
          <p className="text-sm text-[#f0f7ff]/45">Aucun album pour le moment.</p>
        ) : (
          albums.map((album) => (
            <Card key={album.id}>
              <CardHeader>
                <CardTitle className="text-base">{album.title}</CardTitle>
                {album.description ? (
                  <p className="text-sm text-[#f0f7ff]/50">{album.description}</p>
                ) : null}
              </CardHeader>
              <CardContent>
                {album.images.length === 0 ? (
                  <p className="text-sm text-[#f0f7ff]/45">Pas encore d&apos;images.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {album.images.map((img) => (
                      <div
                        key={img.id}
                        className="aspect-square overflow-hidden rounded-xl border border-[#f0f7ff]/10"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
