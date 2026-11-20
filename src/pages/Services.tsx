import { ChevronRight } from 'lucide-react';
import Reveal from '../components/Reveal';
import { CtaBand, PageHero, Section } from '../components/Sections';
import { Button, Panel, mono } from '../components/ui';
import { DIVISIONS } from '../data/site';
import { Link } from '../lib/router';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function Services() {
  useDocumentTitle('Our Services');
  return (
    <>
      <PageHero art="orbit"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Our Services' }]}
        badge="Services Overview"
        title={
          <>
            Integrated Solutions for
            <br />
            Modern Organizations.
          </>
        }
        aside="EMG provides a broad range of professional services through seven service divisions. Clients can engage us for individual assignments or combine services under one coordinated project."
      >
        <div className="flex flex-wrap gap-3">
          <Button to="/request-a-proposal">Request a Service</Button>
          <Button to="/contact" variant="secondary">
            Discuss Your Project
          </Button>
        </div>
      </PageHero>

      {/* Directory — each division as a wide glass row with its subpages */}
      <Section>
        <div className="grid gap-5">
          {DIVISIONS.map((dv, i) => (
            <Reveal key={dv.slug} delay={80 + (i % 3) * 60}>
              <Panel className="group grid gap-6 p-6 transition-colors duration-300 hover:bg-white/[0.14] sm:p-8 lg:grid-cols-[auto_1.1fr_1.4fr] lg:gap-12">
                <span className="font-mono text-[11px] tracking-[0.15em] text-white/60 group-hover:text-accent">{dv.index}</span>
                <div>
                  <Link to={`/services/${dv.slug}`} className="flex items-center gap-2 text-2xl text-white sm:text-3xl">
                    {dv.title}
                    <ChevronRight size={20} className="text-white/60 transition-all group-hover:translate-x-1 group-hover:text-white" />
                  </Link>
                  <p className={`${mono} mt-2 text-[10px] text-accent`}>{dv.headline}</p>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75">{dv.intro}</p>
                  <div className="mt-6">
                    <Button to={`/services/${dv.slug}`} size="sm" variant="secondary" arrow>
                      {dv.cta}
                    </Button>
                  </div>
                </div>
                <ul className="grid content-start gap-x-6 sm:grid-cols-2">
                  {dv.subs.map((s) => (
                    <li key={s.slug}>
                      <Link
                        to={`/services/${dv.slug}/${s.slug}`}
                        className="flex items-center justify-between gap-2 border-b border-white/10 py-3 text-sm text-white/80 transition-colors hover:text-white"
                      >
                        {s.title}
                        <ChevronRight size={13} className="shrink-0 text-white/30" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal className={`${mono} text-center text-[11px] text-white/60`}>
          Individual assignment or combined services — one coordinated team.
        </Reveal>
      </Section>

      <CtaBand title="Combine services under one project." body="Tell us what you need across events, media, digital, branding, AI and training. We will coordinate it through one team." />
    </>
  );
}
