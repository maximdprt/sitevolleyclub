"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { slugify } from "@/lib/utils";

async function guardAdmin() {
  const s = await auth();
  if (!s?.user || s.user.role !== "ADMIN") {
    throw new Error("Non autorisé");
  }
  return s;
}

const matchSchema = z.object({
  teamId: z.string().min(1),
  opponent: z.string().min(1).max(200),
  matchAt: z.string().min(1),
  isHome: z.enum(["true", "false"]),
  location: z.string().max(200).optional(),
  homeScore: z.string().optional(),
  awayScore: z.string().optional(),
});

export async function createMatchAction(formData: FormData) {
  await guardAdmin();
  const raw = Object.fromEntries(formData.entries());
  const parsed = matchSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Données invalides");

  const { teamId, opponent, matchAt, isHome, location, homeScore, awayScore } = parsed.data;
  const resultPublished = formData.get("resultPublished") === "on";
  const hs = homeScore?.trim() ? parseInt(homeScore, 10) : null;
  const as = awayScore?.trim() ? parseInt(awayScore, 10) : null;

  await db.clubMatch.create({
    data: {
      teamId,
      opponent,
      matchAt: new Date(matchAt),
      isHome: isHome === "true",
      location: location || null,
      homeScore: Number.isFinite(hs) ? hs : null,
      awayScore: Number.isFinite(as) ? as : null,
      resultPublished,
    },
  });
  revalidatePath("/admin/matchs");
  revalidatePath("/admin/dashboard");
}

const trainingSchema = z.object({
  teamId: z.string().min(1),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  location: z.string().min(1).max(200),
  note: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : v),
    z.string().max(500).optional(),
  ),
});

export async function createTrainingSlotAction(formData: FormData) {
  await guardAdmin();
  const parsed = trainingSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Données invalides");
  await db.trainingSlot.create({ data: parsed.data });
  revalidatePath("/admin/entrainements");
}

const optionalUrl = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().url().optional(),
);

const eventSchema = z.object({
  type: z.enum(["TOURNOI", "SOIREE_CLUB", "ASSEMBLEE_GENERALE", "STAGE", "AUTRE"]),
  title: z.string().min(2).max(200),
  description: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : v),
    z.string().max(5000).optional(),
  ),
  startAt: z.string().min(1),
  imageUrl: optionalUrl,
  externalUrl: optionalUrl,
});

export async function createClubEventAction(formData: FormData) {
  await guardAdmin();
  const parsed = eventSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Données invalides");
  const d = parsed.data;
  await db.clubEvent.create({
    data: {
      type: d.type,
      title: d.title,
      description: d.description || null,
      startAt: new Date(d.startAt),
      imageUrl: d.imageUrl || null,
      externalUrl: d.externalUrl || null,
    },
  });
  revalidatePath("/admin/evenements");
}

const articleSchema = z.object({
  title: z.string().min(3).max(200),
  metaDescription: z.string().min(50).max(160),
  content: z.string().min(10),
  category: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : v),
    z.string().max(80).optional(),
  ),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  coverImageUrl: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().url().optional(),
  ),
});

export async function createArticleAction(formData: FormData) {
  await guardAdmin();
  const parsed = articleSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Données invalides");
  const d = parsed.data;
  let slug = slugify(d.title);
  const exists = await db.article.findUnique({ where: { slug } });
  if (exists) slug = `${slug}-${Date.now().toString(36)}`;

  await db.article.create({
    data: {
      title: d.title,
      slug,
      metaDescription: d.metaDescription,
      content: d.content,
      category: d.category || null,
      status: d.status,
      coverImageUrl: d.coverImageUrl || null,
      publishedAt: d.status === "PUBLISHED" ? new Date() : null,
    },
  });
  revalidatePath("/admin/articles");
  revalidatePath("/admin/dashboard");
  revalidatePath("/actualites");
}

const albumSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
});

export async function createGalleryAlbumAction(formData: FormData) {
  await guardAdmin();
  const parsed = albumSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Données invalides");
  let slug = slugify(parsed.data.title);
  const exists = await db.galleryAlbum.findUnique({ where: { slug } });
  if (exists) slug = `${slug}-${Date.now().toString(36)}`;
  await db.galleryAlbum.create({
    data: {
      slug,
      title: parsed.data.title,
      description: parsed.data.description || null,
    },
  });
  revalidatePath("/admin/galerie");
}

const imageSchema = z.object({
  albumId: z.string().min(1),
  url: z.string().url(),
  alt: z.string().min(3).max(200),
});

export async function addGalleryImageAction(formData: FormData) {
  await guardAdmin();
  const parsed = imageSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Données invalides");
  const maxOrder = await db.galleryImage.aggregate({
    where: { albumId: parsed.data.albumId },
    _max: { sortOrder: true },
  });
  await db.galleryImage.create({
    data: {
      albumId: parsed.data.albumId,
      url: parsed.data.url,
      alt: parsed.data.alt,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
    },
  });
  revalidatePath("/admin/galerie");
}

export async function approveUserAction(formData: FormData) {
  await guardAdmin();
  const userId = z.string().min(1).parse(formData.get("userId"));
  await db.user.update({
    where: { id: userId },
    data: { status: "ACTIVE" },
  });
  revalidatePath("/admin/membres");
  revalidatePath("/admin/dashboard");
}

export async function suspendUserAction(formData: FormData) {
  await guardAdmin();
  const userId = z.string().min(1).parse(formData.get("userId"));
  await db.user.update({
    where: { id: userId },
    data: { status: "SUSPENDED" },
  });
  revalidatePath("/admin/membres");
}

const convocationSchema = z.object({
  teamId: z.string().min(1),
  title: z.string().min(3).max(200),
  content: z.string().min(5),
  eventAt: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : v),
    z.string().min(1).optional(),
  ),
});

export async function createConvocationAction(formData: FormData) {
  await guardAdmin();
  const parsed = convocationSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Données invalides");
  await db.convocation.create({
    data: {
      teamId: parsed.data.teamId,
      title: parsed.data.title,
      content: parsed.data.content,
      eventAt: parsed.data.eventAt ? new Date(parsed.data.eventAt) : null,
    },
  });
  revalidatePath("/admin/membres");
  revalidatePath("/espace-membre");
}

const assignTeamSchema = z.object({
  userId: z.string().min(1),
  teamId: z.preprocess(
    (v) => (v === "" || v === undefined || v === null || v === "__none" ? undefined : v),
    z.string().min(1).optional(),
  ),
});

export async function assignTeamAction(formData: FormData) {
  await guardAdmin();
  const parsed = assignTeamSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error("Données invalides");
  await db.user.update({
    where: { id: parsed.data.userId },
    data: { teamId: parsed.data.teamId ?? null },
  });
  revalidatePath("/admin/membres");
  revalidatePath("/espace-membre");
}
