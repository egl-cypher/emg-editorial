/** Fixed-window rate limit per client IP, kept in memory (fine for a single Node process). */
export function createRateLimit({ max, windowMs }) {
  const hits = new Map();
  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) if (now - v.start > windowMs) hits.delete(k);
  }, windowMs);
  sweep.unref?.();
  return {
    take(key = 'unknown') {
      const now = Date.now();
      const h = hits.get(key);
      if (!h || now - h.start > windowMs) {
        hits.set(key, { start: now, count: 1 });
        return true;
      }
      h.count += 1;
      return h.count <= max;
    },
  };
}
