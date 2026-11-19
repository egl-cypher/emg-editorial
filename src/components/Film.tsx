import { useEffect, useRef, type CSSProperties } from 'react';
import { HERO_VIDEO } from '../assets';

/**
 * Viewport-aware film: the page shows the showreel in many frames at once, so each frame
 * only attaches its source and plays while it is on (or near) screen, and pauses when it
 * leaves. Keeps decoders low and every visible frame actually moving.
 */
export default function Film({ className = '', style, eager = false }: { className?: string; style?: CSSProperties; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = () => {
      if (!v.src) v.src = HERO_VIDEO;
      if (!reduce) v.play().catch(() => {});
    };
    if (eager) start();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) start();
        else if (!v.paused) v.pause();
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [eager]);
  return <video ref={ref} muted loop playsInline preload={eager ? 'auto' : 'none'} aria-hidden="true" className={className} style={style} />;
}
