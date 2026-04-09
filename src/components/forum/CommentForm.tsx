"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface CommentFormProps {
  postId: string;
}

export function CommentForm({ postId }: CommentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSending(true);
    try {
      const res = await fetch("/api/forum/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: content.trim() }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Erreur lors de l\u2019envoi.");
      }

      setContent("");
      toast.success("Commentaire publié !");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSending(false);
    }
  }

  return (
    <Card>
      <CardContent className="px-5 py-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Votre commentaire (Markdown supporté)…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" loading={sending} disabled={!content.trim()}>
              <Send className="h-4 w-4" />
              Publier
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
