import { db } from "@/lib/db";
import { headers } from "next/headers";

type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "REGISTER"
  | "PASSWORD_RESET_REQUEST"
  | "PASSWORD_RESET"
  | "DOCUMENT_UPLOAD"
  | "DOCUMENT_DELETE"
  | "DOCUMENT_REVIEW"
  | "FORUM_POST_CREATE"
  | "FORUM_POST_DELETE"
  | "FORUM_COMMENT_CREATE"
  | "FORUM_COMMENT_DELETE"
  | "ROLE_CHANGE"
  | "PROFILE_UPDATE";

interface AuditPayload {
  userId: string;
  action: AuditAction;
  resource: string;
  metadata?: Record<string, unknown>;
}

/** Enregistre une action dans les logs d'audit */
export async function createAuditLog({
  userId,
  action,
  resource,
  metadata,
}: AuditPayload): Promise<void> {
  try {
    const reqHeaders = await headers();
    const ipAddress =
      reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() ??
      reqHeaders.get("x-real-ip") ??
      "unknown";
    const userAgent = reqHeaders.get("user-agent") ?? undefined;

    await db.auditLog.create({
      data: {
        userId,
        action,
        resource,
        metadata: metadata ? (metadata as Parameters<typeof db.auditLog.create>[0]["data"]["metadata"]) : undefined,
        ipAddress,
        userAgent,
      },
    });
  } catch {
    // Ne jamais laisser un échec de log bloquer l'opération principale
    console.error("[AuditLog] Échec de l'enregistrement", { userId, action, resource });
  }
}
