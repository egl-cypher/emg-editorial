import { useEffect, useRef, useState } from 'react';
import { HERO_POSTER, HERO_VIDEO } from '../assets';

const MAX_FRAMES = 90;
const MAX_WIDTH = 960;

function drawCover(ctx: CanvasRenderingContext2D, src: CanvasImageSource, sw: number, sh: number, cw: number, ch: number) {
  const scale = Math.max(cw / sw, ch / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  ctx.drawImage(src, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
}

function waitFor(el: HTMLVideoElement, ev: string) {
  return new Promise<void>((res) => el.addEventListener(ev, () => res(), { once: true }));
}

/** Fixed, scroll-scrubbed video layer. `veil` darkens it for text-heavy pages (0–1). */
export default function ScrollVideo({ veil = 0 }: { veil?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<ImageBitmap[]>([]);
  const [hasFrame, setHasFrame] = useState(false);
  const [cacheReady, setCacheReady] = useState(false);

  // Frame extraction from an offscreen video
  useEffect(() => {
    let cancelled = false;
    const visible = videoRef.current;
    if (!visible) return;

    const start = async () => {
      if (visible.readyState < 2) await waitFor(visible, 'loadeddata');
      await new Promise((r) => setTimeout(r, 300));
      if (cancelled) return;

      const off = document.createElement('video');
      off.muted = true;
      off.playsInline = true;
      off.preload = 'auto';
      off.crossOrigin = 'anonymous';
      off.src = HERO_VIDEO;
      await waitFor(off, 'loadedmetadata');
      if (off.readyState < 2) await waitFor(off, 'loadeddata');

      const count = Math.min(MAX_FRAMES, Math.max(24, Math.floor(off.duration * 12)));
      const scale = Math.min(1, MAX_WIDTH / off.videoWidth);
      const w = Math.round(off.videoWidth * scale);
      const h = Math.round(off.videoHeight * scale);
      const frames: ImageBitmap[] = [];

      try {
        for (let i = 0; i < count; i++) {
          if (cancelled) return;
          off.currentTime = (i / (count - 1)) * (off.duration - 0.05);
          await waitFor(off, 'seeked');
          frames.push(await createImageBitmap(off, { resizeWidth: w, resizeHeight: h }));
        }
      } catch {
        return; // CORS-tainted or unsupported: stay on the seek fallback
      }
      if (cancelled) return;
      framesRef.current = frames;
      setCacheReady(true);
    };
    start();
    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll → smoothed progress → draw / seek
  useEffect(() => {
    let raf = 0;
    let smoothed = 0;
    let target = 0;
    let lastIdx = -1;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      lastIdx = -1;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const tick = () => {
      onScroll(); // re-read every frame: page height changes between routes
      smoothed += (target - smoothed) * 0.12;
      const frames = framesRef.current;
      if (frames.length) {
        const idx = Math.round(smoothed * (frames.length - 1));
        if (idx !== lastIdx) {
          const f = frames[idx];
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawCover(ctx, f, f.width, f.height, canvas.width, canvas.height);
          lastIdx = idx;
        }
      } else {
        const v = videoRef.current;
        if (v && v.duration) {
          const t = smoothed * (v.duration - 0.05);
          if (Math.abs(v.currentTime - t) > 0.04 && !v.seeking) v.currentTime = t;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    onScroll();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink">
      <img
        src={HERO_POSTER}
        alt=""
        aria-hidden="true"
        onError={(e) => (e.currentTarget.style.display = 'none')}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          hasFrame || cacheReady ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        onLoadedData={() => setHasFrame(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          hasFrame && !cacheReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
          cacheReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* Legibility veil + warm amber bloom (EMG accent) */}
      <div
        className="absolute inset-0 bg-ink transition-opacity duration-700"
        style={{ opacity: `max(${veil}, var(--dim, 0))` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_100%,rgba(242,179,90,0.16),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_45%,rgba(6,6,6,0.85)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
  );
}
