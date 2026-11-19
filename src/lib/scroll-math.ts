/** Scroll modes used by useScrollVar, expressed as ScrollTrigger ranges. */
export type ScrollMode = 'through' | 'pin' | 'enter';

const RANGES: Record<ScrollMode, { start: string; end: string }> = {
  // 0 when the element's top hits the viewport bottom, 1 when its bottom leaves the top.
  through: { start: 'top bottom', end: 'bottom top' },
  // 0 when its top hits the viewport top, 1 when its bottom hits the viewport bottom (sticky tracks).
  pin: { start: 'top top', end: 'bottom bottom' },
  // 0 when its top hits the viewport bottom, 1 when its top hits the viewport top.
  enter: { start: 'top bottom', end: 'top top' },
};

export function triggerRange(mode: ScrollMode): { start: string; end: string } {
  return { ...RANGES[mode] };
}

/** The --p value each mode rests at when motion is reduced. */
export function restProgress(mode: ScrollMode): number {
  return mode === 'pin' ? 0 : mode === 'through' ? 0.5 : 1;
}
