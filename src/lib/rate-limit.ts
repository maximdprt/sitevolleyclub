import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialisation paresseuse pour éviter les erreurs au build sans Redis configuré
function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

/** 5 tentatives de connexion / 15 min par IP */
export function getLoginRateLimiter() {
  const redis = getRedis();
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    analytics: true,
    prefix: "rl:login",
  });
}

/** 1 post de forum / 2 min par user */
export function getForumPostRateLimiter() {
  const redis = getRedis();
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1, "2 m"),
    analytics: true,
    prefix: "rl:forum:post",
  });
}

/** 1 commentaire / 30s par user */
export function getForumCommentRateLimiter() {
  const redis = getRedis();
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1, "30 s"),
    analytics: true,
    prefix: "rl:forum:comment",
  });
}

/**
 * Vérifie un rate limiter.
 * Retourne { allowed: true } ou { allowed: false, retryAfter: number }
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  if (!limiter) return { allowed: true };

  const result = await limiter.limit(identifier);
  if (!result.success) {
    return {
      allowed: false,
      retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
    };
  }
  return { allowed: true };
}
