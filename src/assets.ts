/**
 * Scroll-scrubbed background video.
 * Replace HERO_VIDEO with EMG's own showreel (1920×1080 MP4, 8–20 s works best).
 * Ideal structure: Create (studio/design) → Capture (camera/lens) → Connect (stage/audience),
 * because the home hero lights up those three words as the video advances.
 * The file must be served with CORS headers (or from /public) for the smooth frame cache.
 */
export const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4';

/** Optional first-frame still. Drop a file at public/hero-poster.jpg. */
export const HERO_POSTER = '/hero-poster.jpg';

/** Optional EMG logo (SVG/PNG in /public). Leave empty to use the typographic wordmark. */
export const LOGO_SRC = '';
