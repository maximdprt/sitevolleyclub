import { z } from "zod";

export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
] as const;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const uploadDocumentSchema = z.object({
  title: z.string().min(2, "Titre requis (min 2 car.)").max(100, "Max 100 car."),
  type: z.enum([
    "PIECE_IDENTITE",
    "CERTIFICAT_MEDICAL",
    "FORMULAIRE_ADHESION",
    "PHOTO_IDENTITE",
    "JUSTIFICATIF_DOMICILE",
    "AUTRE",
  ] as const),
  visibility: z.enum(["PRIVATE", "COMITE", "PUBLIC"] as const).default("PRIVATE"),
  notes: z.string().max(500, "Max 500 car.").optional(),
  fileUrl: z.string().url("URL de fichier invalide"),
  fileName: z.string().min(1),
  fileSize: z.number().max(MAX_FILE_SIZE_BYTES, "Fichier trop volumineux (max 10 Mo)"),
  mimeType: z.string().refine(
    (v) => ACCEPTED_MIME_TYPES.includes(v as (typeof ACCEPTED_MIME_TYPES)[number]),
    "Format non accepté (PDF, JPG, PNG, HEIC)"
  ),
});

export const reviewDocumentSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"] as const),
  notes: z.string().max(500).optional(),
  refusalReason: z.string().max(500).optional(),
});

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
export type ReviewDocumentInput = z.infer<typeof reviewDocumentSchema>;
