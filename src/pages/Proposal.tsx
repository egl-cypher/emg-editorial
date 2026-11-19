import Reveal from '../components/Reveal';
import { ProposalForm } from '../components/Forms';
import { Badge, Panel, headlineMd, mono, pad } from '../components/ui';
import { ABOUT, CONTACT, DIVISIONS, PROPOSAL } from '../data/site';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function Proposal() {
  useDocumentTitle('Request a Proposal');
  const slug = new URLSearchParams(window.location.search).get('service');
  const preset = DIVISIONS.find((d) => d.slug === slug)?.title;
  return (
    <section className={`${pad} pb-24 pt-28 sm:pt-32`}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal className="mb-5">
            <Badge accent>Request a Proposal</Badge>
          </Reveal>
          <Reveal as="h1" delay={120} className={headlineMd}>
            {PROPOSAL.title[0]}
            <br />
            <span className="text-white/60">{PROPOSAL.title[1]}</span>
          </Reveal>
          <Reveal as="p" delay={200} className="mt-6 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
            {PROPOSAL.body}
          </Reveal>
          <Reveal delay={280} className="mt-10 hidden lg:block">
            <span className={`${mono} text-[10px] text-white/60`}>What happens next</span>
            <ol className="mt-4 grid gap-3">
              {ABOUT.approach.slice(0, 3).map((s, i) => (
                <li key={s.title} className="flex gap-4 text-sm text-white/75">
                  <span className="font-mono text-[11px] tracking-[0.15em] text-accent">0{i + 1}</span>
                  <span>
                    <span className="text-white">{s.title}.</span> {s.body}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm text-white/60">Prefer to talk? Call {CONTACT.phones[0]}.</p>
          </Reveal>
        </div>
        <Reveal delay={160}>
          <Panel className="p-6 sm:p-9">
            <ProposalForm confirm={PROPOSAL.confirm} defaultService={preset} />
          </Panel>
        </Reveal>
      </div>
    </section>
  );
}
