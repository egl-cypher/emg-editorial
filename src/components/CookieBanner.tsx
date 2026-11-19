import { useEffect, useState } from 'react';
import { Link } from '../lib/router';

const KEY = 'emg-cookie-consent';

/** Privacy-first cookie notice: only essential cookies until the visitor opts in (brief §14). */
export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      setShow(!localStorage.getItem(KEY));
    } catch {
      setShow(false);
    }
  }, []);
  const choose = (v: 'all' | 'essential') => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent('emg-consent', { detail: v }));
    setShow(false);
  };
  if (!show) return null;
  return (
    <div className="fixed bottom-20 left-3 right-3 z-50 max-w-sm rounded-2xl border border-white/20 bg-card p-5 shadow-[0_18px_40px_-22px_rgba(22,19,15,0.35)] sm:bottom-5 sm:left-auto sm:right-5">
      <p className="text-sm leading-relaxed text-white/85">
        We use essential cookies to run this site. With your permission we'd also use analytics cookies to improve it.{' '}
        <Link to="/cookie-policy" className="underline decoration-white/40 underline-offset-2 hover:text-white">
          Cookie Policy
        </Link>
      </p>
      <div className="mt-4 flex gap-2">
        <button onClick={() => choose('essential')} className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs text-white hover:bg-white/20">
          Essential only
        </button>
        <button onClick={() => choose('all')} className="rounded-full bg-white px-4 py-2 text-xs font-medium text-black hover:bg-white/85">
          Accept analytics
        </button>
      </div>
    </div>
  );
}
