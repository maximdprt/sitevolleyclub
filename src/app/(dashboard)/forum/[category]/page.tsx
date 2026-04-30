import { db } from "@/lib/db";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Pin, Lock, Eye, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { relativeDate } from "@/lib/utils";

interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const session = await auth();

  const category = await db.forumCategory.findUnique({
    where: { slug },
    include: {
      posts: {
        orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
        include: {
          author: { select: { firstName: true, lastName: true } },
          _count: { select: { comments: true } },
        },
      },
    },
  });

  if (!category) notFound();
  const postIds = category.posts.map((p) => p.id);
  const readRows =
    session?.user?.id && postIds.length > 0
      ? await db.forumReadStatus.findMany({
          where: { userId: session.user.id, threadId: { in: postIds } },
          select: { threadId: true, lastReadAt: true },
        })
      : [];
  const readMap = new Map(readRows.map((r) => [r.threadId, r.lastReadAt.getTime()]));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/forum"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#f0f7ff]/40 transition-colors hover:bg-[#f0f7ff]/5 hover:text-[#f0f7ff]/70"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">{category.name}</h1>
          {category.description && (
            <p className="mt-0.5 text-sm text-[#f0f7ff]/50">{category.description}</p>
          )}
        </div>
        <Link href={`/forum/nouveau?category=${slug}`}>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Nouveau post
          </Button>
        </Link>
      </div>

      {category.posts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-[#f0f7ff]/10" />
            <h3 className="mt-4 text-lg font-semibold text-[#f0f7ff]/70">
              Aucune discussion
            </h3>
            <p className="mt-2 text-sm text-[#f0f7ff]/40">
              Soyez le premier à poster dans cette catégorie !
            </p>
            <Link href={`/forum/nouveau?category=${slug}`}>
              <Button className="mt-6" size="sm">Créer un post</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {category.posts.map((post) => (
            <Link key={post.id} href={`/forum/${slug}/${post.slug}`}>
              <Card className="transition-all duration-150 hover:bg-[#f0f7ff]/3 hover:border-[#f0f7ff]/12 cursor-pointer">
                <CardContent className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1a3a5c] text-xs font-semibold text-[#f0f7ff]/60">
                    {post.author.firstName.charAt(0)}{post.author.lastName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-medium text-[#f0f7ff]/90">
                        {post.title}
                      </h3>
                      {post.pinned && <Badge variant="accent"><Pin className="h-3 w-3" /> Épinglé</Badge>}
                      {post.locked && <Badge variant="default"><Lock className="h-3 w-3" /> Verrouillé</Badge>}
                      {(readMap.get(post.id) ?? 0) < post.lastReplyAt.getTime() ? (
                        <Badge variant="accent">Nouveau</Badge>
                      ) : null}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-[#f0f7ff]/30">
                      <span>{post.author.firstName} {post.author.lastName}</span>
                      <span>·</span>
                      <span>{relativeDate(post.lastReplyAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#f0f7ff]/25">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {post._count.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {post.viewCount}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
