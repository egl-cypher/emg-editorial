import { useState } from 'react';
import { Plus } from 'lucide-react';
import Reveal from '../components/Reveal';
import { CtaBand, PageHero, Section } from '../components/Sections';
import { Panel } from '../components/ui';
import { INDUSTRIES } from '../data/site';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function Industries() {
  useDocumentTitle('Industries We Serve');
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <PageHero art="route"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Industries We Serve' }]}
        badge="Industries We Serve"
        title={
          <>
            Sector Experience.
            <br />
            Flexible Solutions.
          </>
        }
        aside="We work with clients across different sectors, adapting our services to their communication, operational and business requirements."
      />
      <Section>
        <Panel className="px-5 sm:px-8">
          {INDUSTRIES.map((ind, i) => {
            const on = open === i;
            return (
              <Reveal key={ind.title} delay={80 + i * 60} className={i < INDUSTRIES.length - 1 ? 'border-b border-white/15' : ''}>
                <button
                  onClick={() => setOpen(on ? null : i)}
                  aria-expanded={on}
                  className="group flex w-full items-center gap-5 py-6 text-left"
                >
                  <span className={`font-mono text-[11px] tracking-[0.15em] ${on ? 'text-accent' : 'text-white/60'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={`flex-1 text-xl transition-colors sm:text-3xl ${on ? 'text-white' : 'text-white/75 group-hover:text-white'}`}>{ind.title}</span>
                  <Plus size={18} className={`text-white/60 transition-transform duration-300 ${on ? 'rotate-45 text-accent' : ''}`} />
                </button>
                <div className={`grid transition-all duration-500 ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="flex flex-wrap gap-2 pb-7 pl-10 sm:pl-12">
                      {ind.body
                        .replace(/\.$/, '')
                        .split(/, (?:and )?| and /)
                        .map((t) => (
                          <span key={t} className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm text-white/85">
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </Panel>
      </Section>
      <CtaBand title="Tell us about your sector and project." />
    </>
  );
}
