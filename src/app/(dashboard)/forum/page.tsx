import { db } from "@/lib/db";
import { auth } from "@/auth";
import Link from "next/link";
import { Plus, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ForumCategoryManager } from "@/components/forum/ForumCategoryManager";
import { relativeDate } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  annonces: "bg-[#e8610a]/10 text-[#e8610a]",
  "vie-asso": "bg-[#2b7fbf]/10 text-[#2b7fbf]",
  "vie-de-lasso": "bg-[#2b7fbf]/10 text-[#2b7fbf]",
  evenements: "bg-emerald-500/10 text-emerald-400",
  entraide: "bg-amber-500/10 text-amber-400",
  "off-topic": "bg-[#f0f7ff]/5 text-[#f0f7ff]/50",
};

export default async function ForumPage() {
  const session = await auth();
  const categories = await db.forumCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { posts: true } },
      posts: {
        orderBy: { updatedAt: "desc" },
        take: 1,
        include: {
          author: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });
  const lastPostIds = categories.map((c) => c.posts[0]?.id).filter(Boolean) as string[];
  const readRows =
    session?.user?.id && lastPostIds.length > 0
      ? await db.forumReadStatus.findMany({
          where: { userId: session.user.id, threadId: { in: lastPostIds } },
          select: { threadId: true, lastReadAt: true },
        })
      : [];
  const readMap = new Map(readRows.map((r) => [r.threadId, r.lastReadAt.getTime()]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-[#f0f7ff]">Forum</h1>
          <p className="mt-1 text-sm text-[#f0f7ff]/50">
            Échangez avec les autres adhérents du club.
          </p>
        </div>
        <Link href="/forum/nouveau">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Nouveau post
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => {
          const lastPost = cat.posts[0];
          const colorClass = CATEGORY_COLORS[cat.slug] ?? "bg-[#f0f7ff]/5 text-[#f0f7ff]/50";
          const unread = lastPost ? (readMap.get(lastPost.id) ?? 0) < lastPost.lastReplyAt.getTime() : false;

          return (
            <Link key={cat.id} href={`/forum/${cat.slug}`}>
              <Card className="transition-all duration-150 hover:bg-[#f0f7ff]/3 hover:border-[#f0f7ff]/12 cursor-pointer">
                <CardContent className="flex items-center gap-4 px-5 py-5">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-[#f0f7ff]/90">{cat.name}</h3>
                      <span className="text-xs text-[#f0f7ff]/25">
                        {cat._count.posts} post{cat._count.posts !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="mt-0.5 text-xs text-[#f0f7ff]/40">{cat.description}</p>
                    )}
                    {lastPost && (
                      <p className="mt-1.5 text-xs text-[#f0f7ff]/25">
                        Dernier : <span className="text-[#f0f7ff]/40">{lastPost.title}</span>
                        {" "}par {lastPost.author.firstName} {lastPost.author.lastName}
                        {" "}· {relativeDate(lastPost.lastReplyAt)}
                        {unread ? <span className="ml-2 rounded-full bg-[#f97316]/20 px-2 py-0.5 text-[10px] text-[#f97316]">Nouveau</span> : null}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#f0f7ff]/15" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {session?.user && ["ADMIN", "COMITE_DIRECTION"].includes(session.user.role) ? (
        <ForumCategoryManager
          categories={categories.map((c) => ({ id: c.id, name: c.name, description: c.description ?? null }))}
        />
      ) : null}
    </div>
  );
}
