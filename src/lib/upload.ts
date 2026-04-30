import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

export const uploadRouter = {
  /** Route pour les documents adhérents (PDF / images, 10 Mo max) */
  memberDocument: f({
    pdf: { maxFileSize: "10MB", maxFileCount: 1 },
    image: { maxFileSize: "10MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      // Vérification de session — requis avant tout upload
      const session = await auth();
      if (!session?.user?.id) throw new Error("Non authentifié");
      if (session.user.status !== "ACTIVE") throw new Error("Compte inactif");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { userId: metadata.userId, fileUrl: file.url, fileName: file.name };
    }),

  /** Route pour les documents comité (COMITE_DIRECTION min) */
  committeeDocument: f({
    pdf: { maxFileSize: "10MB", maxFileCount: 1 },
    image: { maxFileSize: "10MB", maxFileCount: 1 },
    text: { maxFileSize: "10MB", maxFileCount: 1 },
    blob: { maxFileSize: "10MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user?.id) throw new Error("Non authentifié");
      if (!["COMITE_DIRECTION", "ADMIN"].includes(session.user.role)) {
        throw new Error("Accès refusé");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { userId: metadata.userId, fileUrl: file.url, fileName: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
