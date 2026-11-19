import Reveal from '../components/Reveal';
import { InterestForm } from '../components/Forms';
import { PageHero, Section } from '../components/Sections';
import { Panel } from '../components/ui';
import { PARTNERSHIPS } from '../data/site';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function Partnerships() {
  useDocumentTitle('Partnerships');
  return (
    <>
      <PageHero
        crumbs={[{ label: 'About EMG', to: '/about' }, { label: 'Partnerships' }]}
        badge="Partnerships"
        title={
          <>
            Let's Create
            <br />
            More Together.
          </>
        }
        aside={PARTNERSHIPS.body}
      />
      <Section label="We welcome partnerships in">
        <Panel className="px-5 sm:px-8">
          <div className="grid md:grid-cols-2 md:gap-x-12">
            {PARTNERSHIPS.areas.map((a, i) => (
              <Reveal key={a} delay={80 + i * 60} className="flex items-center gap-5 border-b border-white/15 py-5">
                <span className="font-mono text-[11px] tracking-[0.15em] text-white/60">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-lg text-white sm:text-xl">{a}</span>
              </Reveal>
            ))}
          </div>
        </Panel>
      </Section>
      <Section id="form" label="Discuss a Partnership" title="Tell us about the collaboration.">
        <Reveal>
          <Panel className="p-6 sm:p-9">
            <InterestForm
              kind="partnership"
              areas={PARTNERSHIPS.areas}
              submitLabel="Discuss a Partnership"
              confirm="Thank you for your interest in partnering with EMG. Our team will review your message and get in touch."
            />
          </Panel>
        </Reveal>
      </Section>
    </>
  );
}
