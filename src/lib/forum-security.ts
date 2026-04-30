/**
 * Lightweight markdown input sanitization.
 * ReactMarkdown already escapes raw HTML by default; this hardens payloads.
 */
export function sanitizeForumContent(input: string): string {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/on\w+\s*=\s*'[^']*'/gi, "")
    .trim();
}
