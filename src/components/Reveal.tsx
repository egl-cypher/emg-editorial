import { Children, cloneElement, isValidElement, useRef, type ElementType, type ReactElement, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { reducedMotion } from '../lib/motion';

gsap.registerPlugin(useGSAP);

type RevealProps = {
  as?: ElementType;
  delay?: number;
  className?: string;
  id?: string;
  /** 'auto' → headings get a per-word mask reveal, everything else rises in. */
  mode?: 'auto' | 'words' | 'block';
  /** ms between words */
  stagger?: number;
  children: ReactNode;
};

/** Split string children into masked words; keeps elements like <br/> and recurses into <span>/<em>. */
function splitWords(node: ReactNode): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      const parts = String(child).split(/(\s+)/);
      return parts.map((w, k) => {
        if (!w) return null;
        if (/^\s+$/.test(w)) return ' ';
        return (
          <span className="rv-word" key={k}>
            <span>{w}</span>
          </span>
        );
      });
    }
    if (isValidElement(child)) {
      const el = child as ReactElement<{ children?: ReactNode }>;
      if (el.props.children === undefined) return el;
      return cloneElement(el, undefined, splitWords(el.props.children));
    }
    return child;
  });
}

/**
 * Enter-once reveal on GSAP. Headings: word-mask rise. Blocks: rise with a slight tilt.
 * Content is fully visible in static CSS; GSAP sets the start state only when it runs,
 * and does nothing under reduced motion.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', id, mode = 'auto', stagger = 55, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isHeading = typeof Tag === 'string' && /^h[1-3]$/.test(Tag);
  const words = mode === 'words' || (mode === 'auto' && isHeading);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      const targets = words ? el.querySelectorAll('.rv-word > span') : el;
      gsap.from(targets, {
        ...(words ? { yPercent: 112, rotation: 6 } : { opacity: 0, y: 32, rotation: 0.6 }),
        duration: 1.1,
        ease: 'expo.out',
        delay: delay / 1000,
        stagger: words ? stagger / 1000 : 0,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    },
    { scope: ref, dependencies: [words, delay, stagger] },
  );
  if (words) {
    return (
      <Tag ref={ref} id={id} className={className}>
        {splitWords(children)}
      </Tag>
    );
  }
  return (
    <Tag ref={ref} id={id} className={`rv-block ${className}`}>
      {children}
    </Tag>
  );
}
