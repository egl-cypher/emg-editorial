import Reveal from '../components/Reveal';
import { CtaBand, PageHero, Section } from '../components/Sections';
import { Button, IndexRow, Panel, TickList, mono } from '../components/ui';
import { DIVISIONS, type Division as D } from '../data/site';
import { Link } from '../lib/router';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function Division({ dv }: { dv: D }) {
  useDocumentTitle(dv.title);
  const i = DIVISIONS.indexOf(dv);
  const prev = DIVISIONS[(i - 1 + DIVISIONS.length) % DIVISIONS.length];
  const next = DIVISIONS[(i + 1) % DIVISIONS.length];
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Our Services', to: '/services' }, { label: dv.title }]}
        badge={`${dv.index} · ${dv.title}`}
        title={dv.headline}
        aside={dv.intro}
      >
        <div className="flex flex-wrap gap-3">
          <Button to={`/request-a-proposal?service=${dv.slug}`}>{dv.cta}</Button>
          <Button to="/contact" variant="secondary">
            Book a Consultation
          </Button>
        </div>
      </PageHero>

      <Section label="Services" title="Focused services in this division.">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Panel className="px-5 sm:px-6">
            {dv.subs.map((s, k) => (
              <Reveal key={s.slug} delay={120 + k * 80}>
                <IndexRow
                  n={String(k + 1).padStart(2, '0')}
                  title={s.title}
                  body={s.description}
                  to={`/services/${dv.slug}/${s.slug}`}
                  last={k === dv.subs.length - 1}
                  size="lg"
                />
              </Reveal>
            ))}
          </Panel>
          <Reveal delay={200}>
            <Panel className="p-6 sm:p-7 lg:sticky lg:top-28">
              <span className={`${mono} text-[11px] text-accent`}>Services include</span>
              <div className="mt-4">
                <TickList items={dv.includes} />
              </div>
            </Panel>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['Previous division', prev],
            ['Next division', next],
          ].map(([label, x]) => {
            const d = x as D;
            return (
              <Reveal key={label as string}>
                <Link to={`/services/${d.slug}`} className="group block rounded-2xl border border-white/15 bg-card p-6 transition-colors hover:bg-paper-2">
                  <span className={`${mono} text-[10px] text-white/60`}>{label as string}</span>
                  <span className="mt-2 flex items-baseline gap-3 text-xl text-white">
                    <span className="font-mono text-[11px] tracking-[0.15em] text-white/60 group-hover:text-accent">{d.index}</span>
                    {d.title}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <CtaBand title={`${dv.cta}.`} primary={{ label: dv.cta, to: `/request-a-proposal?service=${dv.slug}` }} />
    </>
  );
}
