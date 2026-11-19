/**
 * Tiny dependency-free router (History API). Swap for react-router if the
 * site grows a CMS; every page is just a function of the pathname.
 */
import { createContext, useContext, useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from 'react';

const Ctx = createContext<{ path: string; hash: string }>({ path: '/', hash: '' });

const read = () => ({ path: window.location.pathname.replace(/\/+$/, '') || '/', hash: window.location.hash });

export function navigate(to: string) {
  if (to === window.location.pathname + window.location.hash) return;
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [loc, setLoc] = useState(read);

  useEffect(() => {
    const on = () => setLoc(read());
    window.addEventListener('popstate', on);
    return () => window.removeEventListener('popstate', on);
  }, []);

  // Scroll: to #anchor if present, else top of page
  useEffect(() => {
    const id = loc.hash.slice(1);
    const go = () => {
      const el = id ? document.getElementById(id) : null;
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0 });
    };
    const t = window.setTimeout(go, id ? 80 : 0);
    return () => window.clearTimeout(t);
  }, [loc.path, loc.hash]);

  return <Ctx.Provider value={loc}>{children}</Ctx.Provider>;
}

export const useLocation = () => useContext(Ctx);

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, onClick, ...rest }: LinkProps) {
  const external = /^(https?:|mailto:|tel:)/.test(to);
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (external || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} onClick={handle} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} {...rest} />;
}
