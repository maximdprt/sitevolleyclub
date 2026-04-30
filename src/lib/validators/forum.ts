import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(5, "Titre trop court (min 5 car.)").max(150, "Max 150 car."),
  content: z.string().min(20, "Contenu trop court (min 20 car.)").max(10000, "Max 10 000 car."),
  categoryId: z.string().cuid("Catégorie invalide"),
});

export const createCommentSchema = z.object({
  content: z.string().min(5, "Trop court (min 5 car.)").max(3000, "Max 3 000 car."),
  postId: z.string().cuid("Post invalide"),
});

export const moderatePostSchema = z.object({
  pinned: z.boolean().optional(),
  locked: z.boolean().optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(5).max(150).optional(),
  content: z.string().min(5).max(10000).optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(5).max(3000),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(300).optional(),
  icon: z.string().max(8).optional(),
  color: z.string().max(20).optional(),
  order: z.number().int().min(0).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type ModeratePostInput = z.infer<typeof moderatePostSchema>;
