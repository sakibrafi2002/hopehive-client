/** Only follow redirects that stay on this site, so a crafted ?redirect= link cannot send people elsewhere. */
export function safeRedirect(value: string | string[] | undefined | null, fallback = "/"): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
  return raw;
}

export function withParam(path: string, key: string, value: string): string {
  return `${path}${path.includes("?") ? "&" : "?"}${key}=${encodeURIComponent(value)}`;
}
