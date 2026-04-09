import { db } from "@/lib/db";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, MessageSquare, Eye, Calendar, Pin, Lock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommentForm } from "@/components/forum/CommentForm";
import { relativeDate } from "@/lib/utils";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export default async function PostPage({ params }: Props) {
  const { category, slug } = await params;
  const session = await auth();

  const post = await db.forumPost.findUnique({
    where: { slug },
    include: {
      author: { select: { firstName: true, lastName: true, username: true } },
      category: { select: { name: true, slug: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { firstName: true, lastName: true, username: true } },
        },
      },
    },
  });

  if (!post) notFound();

  await db.forumPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#f0f7ff]/30">
        <Link href="/forum" className="hover:text-[#f0f7ff]/60 transition-colors">Forum</Link>
        <span>/</span>
        <Link href={`/forum/${post.category.slug}`} className="hover:text-[#f0f7ff]/60 transition-colors">
          {post.category.name}
        </Link>
      </div>

      {/* Post */}
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            {post.pinned && <Badge variant="accent"><Pin className="h-3 w-3" /> Épinglé</Badge>}
            {post.locked && <Badge variant="default"><Lock className="h-3 w-3" /> Verrouillé</Badge>}
          </div>
          <h1 className="text-xl font-bold text-[#f0f7ff]">{post.title}</h1>
          <div className="flex items-center gap-4 text-xs text-[#f0f7ff]/30">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a3a5c] text-[10px] font-semibold text-[#f0f7ff]/60">
                {post.author.firstName.charAt(0)}{post.author.lastName.charAt(0)}
              </div>
              <span className="text-[#f0f7ff]/60">
                {post.author.firstName} {post.author.lastName}
              </span>
            </div>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{relativeDate(post.createdAt)}</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.viewCount + 1} vues</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert prose-sm max-w-none text-[#f0f7ff]/80 prose-headings:text-[#f0f7ff] prose-a:text-[#2b7fbf] prose-strong:text-[#f0f7ff]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Commentaires */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[#f0f7ff]/70">
          <MessageSquare className="h-4 w-4" />
          {post.comments.length} commentaire{post.comments.length !== 1 ? "s" : ""}
        </h2>

        {post.comments.length === 0 ? (
          <p className="text-sm text-[#f0f7ff]/30">
            Aucun commentaire pour le moment. Soyez le premier !
          </p>
        ) : (
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="px-5 py-4">
                  <div className="mb-3 flex items-center gap-2 text-xs">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1a3a5c] text-[10px] font-semibold text-[#f0f7ff]/60">
                      {comment.author.firstName.charAt(0)}{comment.author.lastName.charAt(0)}
                    </div>
                    <span className="font-medium text-[#f0f7ff]/60">
                      {comment.author.firstName} {comment.author.lastName}
                    </span>
                    <span className="text-[#f0f7ff]/20">·</span>
                    <span className="text-[#f0f7ff]/25">{relativeDate(comment.createdAt)}</span>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none text-[#f0f7ff]/70">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.content}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Formulaire commentaire */}
        {!post.locked && session?.user && (
          <CommentForm postId={post.id} />
        )}

        {post.locked && (
          <div className="rounded-xl border border-[#f0f7ff]/8 bg-[#f0f7ff]/2 px-4 py-3 text-center text-sm text-[#f0f7ff]/30">
            <Lock className="mx-auto mb-1 h-4 w-4" />
            Cette discussion est verrouillée.
          </div>
        )}
      </div>
    </div>
  );
}
