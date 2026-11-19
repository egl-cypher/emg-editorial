import { useEffect, useRef } from 'react';
import Backdrop from './components/Backdrop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileActions from './components/MobileActions';
import CookieBanner from './components/CookieBanner';
import { RouterProvider, useLocation } from './lib/router';
import { useSmoothScroll, useSpotlight, getLenis, onFrame, refreshScroll } from './lib/motion';
import { findDivision } from './data/site';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Division from './pages/Division';
import ServiceDetail from './pages/ServiceDetail';
import Work from './pages/Work';
import Industries from './pages/Industries';
import Insights from './pages/Insights';
import Contact from './pages/Contact';
import Proposal from './pages/Proposal';
import Partnerships from './pages/Partnerships';
import Careers from './pages/Careers';
import Legal from './pages/Legal';
import DesignSystem from './pages/DesignSystem';
import NotFound from './pages/NotFound';

function route(path: string): { page: React.ReactNode; veil: number } {
  const seg = path.split('/').filter(Boolean);
  if (seg.length === 0) return { page: <Home />, veil: 0.15 };
  const [a, b, c] = seg;
  if (a === 'services') {
    if (!b) return { page: <Services />, veil: 0.62 };
    const dv = findDivision(b);
    if (!dv) return { page: <NotFound />, veil: 0.67 };
    if (!c) return { page: <Division dv={dv} />, veil: 0.62 };
    const sub = dv.subs.find((s) => s.slug === c);
    return sub ? { page: <ServiceDetail dv={dv} sub={sub} />, veil: 0.67 } : { page: <NotFound />, veil: 0.67 };
  }
  const map: Record<string, [React.ReactNode, number]> = {
    about: [<About />, 0.62],
    work: [<Work />, 0.62],
    industries: [<Industries />, 0.62],
    insights: [<Insights />, 0.67],
    contact: [<Contact />, 0.77],
    'request-a-proposal': [<Proposal />, 0.82],
    partnerships: [<Partnerships />, 0.72],
    careers: [<Careers />, 0.72],
    'privacy-policy': [<Legal title="Privacy Policy" />, 0.82],
    'terms-of-service': [<Legal title="Terms of Service" />, 0.82],
    'cookie-policy': [<Legal title="Cookie Policy" />, 0.82],
    'design-system': [<DesignSystem />, 0.67],
  };
  const hit = seg.length === 1 ? map[a] : undefined;
  return hit ? { page: hit[0], veil: hit[1] } : { page: <NotFound />, veil: 0.67 };
}

function Shell() {
  const { path } = useLocation();
  const { page } = route(path);
  useSmoothScroll();
  useSpotlight();
  useEffect(() => {
    const l = getLenis();
    if (l) l.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    // Measure every ScrollTrigger against the new page once it has rendered.
    const raf = requestAnimationFrame(() => refreshScroll());
    return () => cancelAnimationFrame(raf);
  }, [path]);
  return (
    <div className="relative">
      <Backdrop />
      <div className="relative z-10">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black">
          Skip to content
        </a>
        <Navbar />
        <main id="main" key={path}>
          {page}
        </main>
        <Footer />
      </div>
      <MobileActions />
      <CookieBanner />
      <div className="grain" aria-hidden="true" />
      {/* Route curtain: a panel wipes up off the screen on every navigation */}
      <div key={`c-${path}`} aria-hidden="true" className="curtain pointer-events-none fixed inset-0 z-[75] bg-ink" />
      <ProgressRule />
    </div>
  );
}

/** Reading-progress hairline in REC red along the top edge. */
function ProgressRule() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    return onFrame(() => {
      const el = ref.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    });
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div ref={ref} className="h-full origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <Shell />
    </RouterProvider>
  );
}
