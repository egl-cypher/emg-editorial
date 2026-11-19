import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { getLenis } from '../lib/motion';

export const SHOWREEL_SRC = '/films/emg-hero-showreel.mp4';
export const SHOWREEL_POSTER = '/films/emg-hero-showreel-poster.jpg';

/**
 * Full-size player for the hero showreel. Solid ink backdrop (no glass), native controls,
 * Esc / backdrop / close button to dismiss, focus moves in on open and back to the trigger on close,
 * and page scrolling (Lenis) pauses while it is open.
 */
export default function ShowreelModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    videoRef.current?.play().catch(() => {});
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        // keep focus inside the dialog: close button <-> video
        const items = [closeRef.current, videoRef.current].filter(Boolean) as HTMLElement[];
        const i = items.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        items[(i + (e.shiftKey ? items.length - 1 : 1)) % items.length]?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      lenis?.start();
      prev?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="EMG showreel"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 sm:p-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close the showreel"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-black text-white transition-colors hover:bg-accent hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:right-6 sm:top-6"
      >
        <X size={20} aria-hidden="true" />
      </button>
      <video
        ref={videoRef}
        src={SHOWREEL_SRC}
        poster={SHOWREEL_POSTER}
        controls
        playsInline
        loop
        muted
        className="aspect-video max-h-full w-full max-w-6xl rounded-[10px] bg-ink shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]"
      >
        <track kind="captions" />
      </video>
    </div>,
    document.body,
  );
}
