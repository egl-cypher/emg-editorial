import { useRef } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useGSAP } from '@gsap/react';
import { BRAND } from '../data/site';
import { reducedMotion } from '../lib/motion';

gsap.registerPlugin(TextPlugin, useGSAP);

const WORDS = BRAND.tagline.map((w) => w.toLowerCase());

/**
 * "We create" with the last word typed out and swapped through EMG's tagline
 * (create → capture → connect). Reduced motion: the full tagline, static.
 * Screen readers hear the tagline once; the typing is visual only.
 */
export default function TypedTagline({ className = '' }: { className?: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const reduce = reducedMotion();

  useGSAP(
    () => {
      const el = word.current;
      if (reduce || !el) return;
      const tl = gsap.timeline({ repeat: -1, delay: 1.6 });
      WORDS.forEach((w, i) => {
        const next = WORDS[(i + 1) % WORDS.length];
        tl.to(el, { text: '', duration: w.length * 0.04, ease: 'none' })
          .to(el, { text: next, duration: next.length * 0.07, ease: 'none' }, '+=0.15')
          .to({}, { duration: 1.8 });
      });
    },
    { scope: root },
  );

  return (
    <span ref={root} data-tagline className={className}>
      <span className="sr-only">We {WORDS.slice(0, -1).join(', ')} and {WORDS[WORDS.length - 1]}</span>
      <span aria-hidden="true">
        We{' '}
        {reduce ? (
          WORDS.join(' / ')
        ) : (
          <>
            {/* Fixed width (longest word) so the centred strip doesn't shift while typing. */}
            <span ref={word} className="inline-block text-left text-accent" style={{ minWidth: `${Math.max(...WORDS.map((w) => w.length))}ch` }}>
              {WORDS[0]}
            </span>
            <span className="type-caret ml-px inline-block w-[0.6ch] text-accent">|</span>
          </>
        )}
      </span>
    </span>
  );
}
