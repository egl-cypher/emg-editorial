/**
 * MarqueeBackdrop: a giant, faint phrase drifting behind a section's content.
 *
 * Adapted from 21st.dev "Worth Keeping CTA" (ziegfiroyt/cta69,
 * https://21st.dev/@ziegfiroyt/components/cta69): only its scrolling backdrop is used.
 * Changes from the source: Fraunces (`.display`) in ink at 6% instead of a bold sans,
 * the CSS keyframe loop replaced by a GSAP tween that only runs while the section is
 * on screen, and no motion at all under prefers-reduced-motion (the phrase stays still).
 * No Next.js `Link`, `cn` or styled-jsx dependencies.
 */
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { reducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The loop is two identical halves slid by exactly half the track width, so one half
 * must be wider than the screen; repeating the phrase is what keeps it seamless.
 */
const REPEATS = 6;

export default function MarqueeBackdrop({
  phrase,
  duration = 60,
  className = '',
}: {
  phrase: string;
  /** Seconds for one half of the track to pass. */
  duration?: number;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const line = `${phrase} · `.repeat(REPEATS);

  useGSAP(
    () => {
      if (reducedMotion() || !track.current || !root.current) return;
      const tween = gsap.to(track.current, { xPercent: -50, duration, ease: 'none', repeat: -1, paused: true });
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (st) => (st.isActive ? tween.play() : tween.pause()),
      });
    },
    { scope: root, dependencies: [duration] },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 flex select-none items-center overflow-hidden ${className}`}
    >
      <div ref={track} className="flex w-max shrink-0 whitespace-nowrap text-white/[0.04] md:text-white/[0.06]">
        {[0, 1].map((copy) => (
          <span key={copy} className="display text-[22vw] leading-none tracking-[-0.03em] md:text-[15vw]">
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
