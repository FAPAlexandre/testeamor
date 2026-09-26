/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Extracts a YouTube Video ID from various link formats.
 * e.g.,
 * - https://www.youtube.com/watch?v=lp-EO5I60KA
 * - https://youtu.be/lp-EO5I60KA
 * - https://www.youtube.com/embed/lp-EO5I60KA
 * - https://music.youtube.com/watch?v=lp-EO5I60KA&feature=share
 * - lp-EO5I60KA
 */
export function extractYouTubeVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex covering standard watch URLs, short URLs, embeds, music.youtube
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /youtube\.com\/shorts\/([^"&?\/\s]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
