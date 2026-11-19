import Reveal from '../components/Reveal';
import { InterestForm } from '../components/Forms';
import { PageHero, Section } from '../components/Sections';
import { Panel, mono } from '../components/ui';
import { CAREERS } from '../data/site';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function Careers() {
  useDocumentTitle('Careers & Professional Network');
  return (
    <>
      <PageHero
        crumbs={[{ label: 'About EMG', to: '/about' }, { label: 'Careers' }]}
        badge="Careers & Professional Network"
        title={
          <>
            Bring Your Expertise
            <br />
            to EMG.
          </>
        }
        aside={CAREERS.body}
      />
      <Section label="Areas of interest">
        <div className="flex flex-wrap gap-2.5">
          {CAREERS.areas.map((a, i) => (
            <Reveal key={a} delay={60 + i * 50}>
              <span className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-card px-5 py-3 text-base text-white">
                <span className="font-mono text-[10px] tracking-[0.15em] text-accent">{String(i + 1).padStart(2, '0')}</span>
                {a}
              </span>
            </Reveal>
          ))}
        </div>
        <Reveal delay={300} className={`${mono} mt-10 max-w-xl text-[11px] leading-relaxed text-white/60`}>
          {CAREERS.note}
        </Reveal>
      </Section>
      <Section id="form" label="Join Our Professional Network" title="Send us your profile.">
        <Reveal>
          <Panel className="p-6 sm:p-9">
            <InterestForm
              kind="careers"
              areas={CAREERS.areas}
              cv
              submitLabel="Join Our Professional Network"
              confirm="Thank you for your interest in EMG's professional network. We have received your profile and will be in touch when a suitable opportunity arises."
            />
          </Panel>
        </Reveal>
      </Section>
    </>
  );
}
