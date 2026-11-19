import { Link } from '../lib/router';
import { BRAND, CONTACT, DIVISIONS } from '../data/site';
import { LensMark } from './Wordmark';
import { mono, pad } from './ui';
import { useScrollVar } from '../lib/motion';

const cols = [
  {
    title: 'Company',
    links: [
      ['About EMG', '/about'],
      ['Leadership & Team', '/about#team'],
      ['Our Work', '/work'],
      ['Careers', '/careers'],
      ['Insights & News', '/insights'],
    ],
  },
  { title: 'Services', links: DIVISIONS.map((d) => [d.short, `/services/${d.slug}`]) },
  {
    title: 'Connect',
    links: [
      ['Contact Us', '/contact'],
      ['Request a Proposal', '/request-a-proposal'],
      ['Partnership Enquiries', '/partnerships'],
      ['Join Our Network', '/careers'],
    ],
  },
];

/**
 * The footer is the darkroom: an ink slab that the paper page lifts off.
 * (Theme note: `text-black` is paper here.)
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const ref = useScrollVar<HTMLElement>('enter');
  return (
    <footer ref={ref} className="relative z-10 overflow-clip bg-ink text-black">
      <div className={`${pad} flex flex-col gap-10 border-b border-black/10 pb-14 pt-20 lg:flex-row lg:items-end lg:justify-between`}>
        <p className="display max-w-3xl text-[clamp(2.4rem,5.4vw,5rem)] leading-[1] text-black">
          Create. Capture. <span className="serif-i text-accent-soft">Connect.</span>
        </p>
        <Link
          to="/request-a-proposal"
          className="group inline-flex h-14 shrink-0 items-center gap-4 self-start rounded-[8px] bg-black pl-6 pr-2 text-sm font-medium text-white transition-colors hover:bg-accent hover:text-black lg:self-auto"
        >
          Request a Proposal
          <span className="grid h-10 w-10 place-items-center rounded-[6px] bg-white text-black transition-transform duration-500 group-hover:rotate-45">↗</span>
        </Link>
      </div>

      <div className={`${pad} grid gap-12 py-14 md:grid-cols-2 xl:grid-cols-[1.4fr_repeat(3,1fr)_1.2fr]`}>
        <div className="max-w-xs">
          <span className="flex items-center gap-3 text-black">
            <LensMark size={34} />
            <span className="text-[15px] font-medium tracking-[-0.01em]">Exclusive Multimedia Group</span>
          </span>
          <p className="mt-6 text-sm leading-relaxed text-black/55">{BRAND.footerLine}</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className={`${mono} text-[10px] text-black/40`}>{c.title}</h4>
            <ul className="mt-5 grid gap-2.5">
              {c.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="group inline-flex items-center text-sm text-black/75 transition-colors duration-300 hover:text-black">
                    <span className="h-px w-0 bg-accent-soft transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:mr-2 group-hover:w-3" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 className={`${mono} text-[10px] text-black/40`}>Contact</h4>
          <address className="mt-5 grid gap-1.5 text-sm not-italic text-black/75">
            <span>{CONTACT.addressLines.join(', ')}</span>
            {CONTACT.footerPhones.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="hover:text-black">
                {p}
              </a>
            ))}
            {CONTACT.email && (
              <a href={`mailto:${CONTACT.email}`} className="hover:text-black">
                {CONTACT.email}
              </a>
            )}
          </address>
        </div>
      </div>

      {/* giant serif wordmark rising from the floor */}
      <div aria-hidden="true" className="relative h-[clamp(5rem,17vw,15rem)] select-none overflow-hidden">
        <div
          className="display absolute inset-x-0 top-0 whitespace-nowrap text-center text-[clamp(6rem,26vw,24rem)] leading-[0.82] text-black/[0.09]"
          style={{ transform: 'translate3d(0, calc((1 - var(--p,0)) * 45%), 0)' }}
        >
          E<span className="serif-i">m</span>G
        </div>
      </div>

      <div className={`${pad} flex flex-col gap-3 border-t border-black/10 py-5 pb-24 text-xs text-black/45 sm:flex-row sm:items-center sm:justify-between sm:pb-5`}>
        <span>© {year} Exclusive Multimedia Group. All Rights Reserved.</span>
        <span className="flex flex-wrap gap-5">
          <Link to="/privacy-policy" className="hover:text-black">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-black">Terms of Service</Link>
          <Link to="/cookie-policy" className="hover:text-black">Cookie Policy</Link>
        </span>
      </div>
    </footer>
  );
}
