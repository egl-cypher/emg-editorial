import Reveal from '../components/Reveal';
import { CtaBand, PageHero, Section } from '../components/Sections';
import { Button, Panel, mono } from '../components/ui';
import type { Division, SubService } from '../data/site';
import { Link } from '../lib/router';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function ServiceDetail({ dv, sub }: { dv: Division; sub: SubService }) {
  useDocumentTitle(sub.title);
  const others = dv.subs.filter((s) => s.slug !== sub.slug);
  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Our Services', to: '/services' },
          { label: dv.title, to: `/services/${dv.slug}` },
          { label: sub.title },
        ]}
        badge={dv.title}
        title={sub.title}
        aside={sub.description}
      >
        <div className="flex flex-wrap gap-3">
          <Button to={`/request-a-proposal?service=${dv.slug}`}>Request a Proposal</Button>
          <Button to="/contact" variant="secondary">
            Discuss Your Project
          </Button>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {sub.deliverables ? (
            <Reveal>
              <Panel className="p-6 sm:p-8">
                <span className={`${mono} text-[11px] text-accent`}>Deliverables</span>
                <ol className="mt-5 grid gap-x-8 sm:grid-cols-2">
                  {sub.deliverables.map((d, i) => (
                    <li key={d} className="flex gap-4 border-b border-white/10 py-4">
                      <span className="pt-0.5 font-mono text-[11px] tracking-[0.15em] text-white/60">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[15px] text-white/90">{d.charAt(0).toUpperCase() + d.slice(1)}</span>
                    </li>
                  ))}
                </ol>
              </Panel>
            </Reveal>
          ) : (
            <Reveal>
              <Panel className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
                <span className={`${mono} text-[11px] text-accent`}>How we work</span>
                <p className="text-2xl leading-snug text-white">
                  Every engagement follows our structured process: Understand, Plan, Create, Deliver and Improve.
                </p>
                <div>
                  <Button to="/about#approach" variant="secondary">
                    Our Approach
                  </Button>
                </div>
              </Panel>
            </Reveal>
          )}

          <Reveal delay={150}>
            <Panel className="p-6 sm:p-7">
              <span className={`${mono} text-[11px] text-white/60`}>Also in {dv.title}</span>
              <ul className="mt-3">
                {others.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services/${dv.slug}/${s.slug}`} className="block border-b border-white/10 py-3 text-sm text-white/80 transition-colors last:border-0 hover:text-white">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>
        </div>
      </Section>

      <CtaBand title="Have a similar project?" body="Tell us about your project and receive a response with the appropriate next steps." primary={{ label: 'Request a Proposal', to: `/request-a-proposal?service=${dv.slug}` }} />
    </>
  );
}
