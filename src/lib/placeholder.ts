// Shown whenever an image URL is missing or fails to load, so cards keep their shape instead of breaking.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f766e"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs>
<rect width="640" height="400" fill="url(#g)"/>
<g fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" transform="translate(264 144)">
<path d="M56 100 C8 64 0 28 24 12 C40 2 56 12 56 28 C56 12 72 2 88 12 C112 28 104 64 56 100 Z"/>
</g>
</svg>`;

export const PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export function initials(name: string | null | undefined): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}
