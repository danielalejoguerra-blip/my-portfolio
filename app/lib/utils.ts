import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts common image-sharing URL formats to a direct/embeddable image URL.
 * Supported: Google Drive share links, Imgur albums, Dropbox share links.
 */
export function normalizeImageUrl(url: string): string {
  const trimmed = url.trim();

  // Google Drive: /file/d/{ID}/view or /file/d/{ID}/preview
  // Note: uc?export=view is deprecated and returns 403 — use thumbnail endpoint instead
  const gdriveFile = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gdriveFile) {
    return `https://drive.google.com/thumbnail?id=${gdriveFile[1]}&sz=w1600`;
  }

  // Google Drive: open?id={ID}
  const gdriveOpen = trimmed.match(/drive\.google\.com\/open\?[^#]*id=([a-zA-Z0-9_-]+)/);
  if (gdriveOpen) {
    return `https://drive.google.com/thumbnail?id=${gdriveOpen[1]}&sz=w1600`;
  }

  // Google Drive: uc?id={ID}
  const gdriveUc = trimmed.match(/drive\.google\.com\/uc\?[^#]*\bid=([a-zA-Z0-9_-]+)/);
  if (gdriveUc) {
    return `https://drive.google.com/thumbnail?id=${gdriveUc[1]}&sz=w1600`;
  }

  // Imgur: https://imgur.com/{ID}  (not i.imgur.com, not /a/ albums)
  const imgur = trimmed.match(/^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]+)$/);
  if (imgur) {
    return `https://i.imgur.com/${imgur[1]}.jpg`;
  }

  // Dropbox: ?dl=0 → ?raw=1  (direct image display)
  if (/dropbox\.com/.test(trimmed) && /[?&]dl=0/.test(trimmed)) {
    return trimmed.replace(/([?&])dl=0/, '$1raw=1');
  }

  return trimmed;
}
