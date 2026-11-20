import Reveal from '../components/Reveal';
import NetworkMap from '../components/NetworkMap';
import ApproachLine from '../components/ApproachLine';
import { CtaBand, PageHero, Section } from '../components/Sections';
import { Button, IndexRow, Panel, mono } from '../components/ui';
import { ABOUT, NETWORK } from '../data/site';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function About() {
  useDocumentTitle('About EMG');
  return (
    <>
      <PageHero art="orbit"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'About EMG' }]}
        badge="About Us"
        title={
          <>
            {ABOUT.title[0]}
            <br />
            {ABOUT.title[1]}
            <br />
            <span className="serif-i text-accent">{ABOUT.title[2]}</span>
          </>
        }
        aside={ABOUT.paras[1]}
      />

      <Section id="who-we-are" label="Who We Are">
        <div className="grid gap-10 md:grid-cols-2 md:gap-20">
          <Reveal as="p" delay={100} className="text-2xl leading-snug text-white drop-shadow-md sm:text-3xl">
            {ABOUT.paras[0]}
          </Reveal>
          <div className="grid gap-5">
            {ABOUT.paras.slice(2).map((p, i) => (
              <Reveal as="p" key={i} delay={180 + i * 80} className="text-sm leading-relaxed text-white/80 sm:text-base">
                {p}
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section id="mission" label="Mission & Vision">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            ['Our Mission', ABOUT.mission],
            ['Our Vision', ABOUT.vision],
          ].map(([t, b], i) => (
            <Reveal key={t} delay={120 + i * 120}>
              <Panel className="flex h-full flex-col justify-between gap-10 p-7 sm:p-9">
                <span className={`${mono} text-[11px] text-accent`}>0{i + 1} · {t}</span>
                <p className="text-2xl leading-snug text-white sm:text-3xl">{b}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="values" label="Our Values" title="Six standards in every engagement.">
        <div className="grid gap-6 md:grid-cols-2">
          {[ABOUT.values.slice(0, 3), ABOUT.values.slice(3)].map((col, c) => (
            <Panel key={c} className="px-5 sm:px-6">
              {col.map((v, i) => (
                <Reveal key={v.title} delay={150 + (c * 3 + i) * 80}>
                  <IndexRow n={String(c * 3 + i + 1).padStart(2, '0')} title={v.title} body={v.body} last={i === col.length - 1} />
                </Reveal>
              ))}
            </Panel>
          ))}
        </div>
      </Section>

      <Section id="network" label="Our Regional Network" title={ABOUT.network.title} intro={ABOUT.network.body}>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <Reveal delay={120}>
            <NetworkMap />
          </Reveal>
          <Reveal delay={220}>
            <Panel className="px-5 sm:px-6">
              <p className={`${mono} border-b border-white/15 py-4 text-[10px] text-white/60`}>
                EMG's regional team network includes professionals based in
              </p>
              {NETWORK.map((n, i) => (
                <div key={n.country} className={`flex items-center justify-between py-4 ${i < NETWORK.length - 1 ? 'border-b border-white/15' : ''}`}>
                  <span className="flex items-center gap-4">
                    <span className="font-mono text-[11px] tracking-[0.15em] text-white/60">0{i + 1}</span>
                    <span className="text-lg text-white">{n.country}</span>
                  </span>
                  {n.hq && <span className={`${mono} rounded-full bg-accent px-2.5 py-1 text-[9px] text-black`}>Headquarters</span>}
                </div>
              ))}
            </Panel>
          </Reveal>
        </div>
      </Section>

      <Section id="approach" label="Our Approach" title="Every engagement follows a structured process.">
        <ApproachLine />
      </Section>

      <Section id="team" label="Leadership & Team" title={ABOUT.team.title}>
        <div className="grid gap-10 md:grid-cols-2 md:gap-20">
          <div className="grid gap-5">
            {ABOUT.team.paras.map((p, i) => (
              <Reveal as="p" key={i} delay={120 + i * 80} className="text-sm leading-relaxed text-white/80 sm:text-base">
                {p}
              </Reveal>
            ))}
            <Reveal delay={300}>
              <Button to="/contact">Work With Our Team</Button>
            </Reveal>
          </div>
          <Reveal delay={200} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {/* Team profile slots: add only verified people, titles and photos */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex aspect-[4/5] flex-col justify-end rounded-xl border border-dashed border-white/20 bg-card p-3">
                <span className={`${mono} text-[9px] text-white/60`}>Team profile</span>
                <span className="mt-1 h-2 w-3/4 rounded bg-white/10" />
              </div>
            ))}
          </Reveal>
        </div>
      </Section>

      <Section id="partners" label="Partners & Collaborators">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal delay={100}>
            <Panel className="flex h-full flex-col justify-between gap-8 p-7 sm:p-9">
              <p className="text-lg leading-relaxed text-white/90">{ABOUT.partners}</p>
              <div>
                <Button to="/partnerships" variant="secondary">
                  Explore Partnership Opportunities
                </Button>
              </div>
            </Panel>
          </Reveal>
          <Reveal delay={200}>
            <Panel className="flex h-full flex-col justify-between gap-8 p-7 sm:p-9">
              <div>
                <span className={`${mono} text-[11px] text-accent`}>Careers</span>
                <p className="mt-4 text-lg leading-relaxed text-white/90">{ABOUT.careers}</p>
              </div>
              <div>
                <Button to="/careers" variant="secondary">
                  Submit Your Interest
                </Button>
              </div>
            </Panel>
          </Reveal>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
