-- Document type extension
ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'PHOTO_IDENTITE';

-- Document moderation metadata
ALTER TABLE "Document"
ADD COLUMN "refusalReason" TEXT;

CREATE INDEX "Document_userId_status_idx" ON "Document"("userId", "status");
CREATE INDEX "Document_userId_type_idx" ON "Document"("userId", "type");
CREATE INDEX "Document_uploadedAt_idx" ON "Document"("uploadedAt");

-- Forum enrichments
ALTER TABLE "ForumPost"
ADD COLUMN "lastReplyAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "editedAt" TIMESTAMP(3);

ALTER TABLE "ForumComment"
ADD COLUMN "editedAt" TIMESTAMP(3);

CREATE TABLE "ForumReadStatus" (
    "userId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ForumReadStatus_pkey" PRIMARY KEY ("userId","threadId")
);

CREATE INDEX "ForumReadStatus_lastReadAt_idx" ON "ForumReadStatus"("lastReadAt");

ALTER TABLE "ForumReadStatus" ADD CONSTRAINT "ForumReadStatus_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ForumReadStatus" ADD CONSTRAINT "ForumReadStatus_threadId_fkey"
FOREIGN KEY ("threadId") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Comite folders/documents
CREATE TABLE "ComiteFolder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ComiteFolder_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ComiteDocument" (
    "id" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ComiteDocument_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ComiteFolder_parentId_idx" ON "ComiteFolder"("parentId");
CREATE INDEX "ComiteFolder_createdBy_idx" ON "ComiteFolder"("createdBy");
CREATE INDEX "ComiteDocument_folderId_uploadedAt_idx" ON "ComiteDocument"("folderId","uploadedAt");
CREATE INDEX "ComiteDocument_fileName_idx" ON "ComiteDocument"("fileName");

ALTER TABLE "ComiteFolder" ADD CONSTRAINT "ComiteFolder_parentId_fkey"
FOREIGN KEY ("parentId") REFERENCES "ComiteFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ComiteFolder" ADD CONSTRAINT "ComiteFolder_createdBy_fkey"
FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ComiteDocument" ADD CONSTRAINT "ComiteDocument_folderId_fkey"
FOREIGN KEY ("folderId") REFERENCES "ComiteFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ComiteDocument" ADD CONSTRAINT "ComiteDocument_uploadedBy_fkey"
FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
