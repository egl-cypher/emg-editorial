import { useState } from 'react';
import Reveal from '../components/Reveal';
import { CtaBand, PageHero, Section } from '../components/Sections';
import { Panel, PendingSlot, mono } from '../components/ui';
import { PROJECTS, WORK } from '../data/site';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { ProjectCard } from './Home';

export default function Work() {
  useDocumentTitle('Our Work');
  const [cat, setCat] = useState(WORK.categories[0]);
  const list = cat === 'Featured Projects' ? PROJECTS : PROJECTS.filter((p) => p.category === cat);
  return (
    <>
      <PageHero art="viewfinder" crumbs={[{ label: 'Home', to: '/' }, { label: 'Our Work' }]} badge="Portfolio" title={WORK.title} aside={WORK.body} />

      <Section>
        <Reveal className="mb-8 flex flex-wrap gap-2" >
          {WORK.categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`${mono} rounded-full border px-3.5 py-2 text-[10px] transition-colors duration-300 ${
                cat === c ? 'border-accent bg-accent text-black' : 'border-white/20 bg-card text-white/80 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.length
            ? list.map((p, i) => (
                <Reveal key={p.slug} delay={100 + (i % 3) * 90}>
                  <ProjectCard {...p} />
                </Reveal>
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <Reveal key={i} delay={100 + (i % 3) * 90}>
                  <PendingSlot label={`${cat} — project ${i + 1}`} note="Verified projects with client permission will appear here." />
                </Reveal>
              ))}
        </div>
      </Section>

      <Section id="case-studies" label="Project Case Studies" title="What every case study shows." intro="Each featured project should include the following, published only where the client has given permission.">
        <Panel className="px-5 sm:px-6">
          <ol className="grid gap-x-10 md:grid-cols-2">
            {WORK.caseStudyFields.map((f, i) => (
              <Reveal as="li" key={f} delay={100 + i * 60} className="flex gap-5 border-b border-white/15 py-5">
                <span className="pt-0.5 font-mono text-[11px] tracking-[0.15em] text-white/60">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base text-white">{f}</span>
              </Reveal>
            ))}
          </ol>
        </Panel>
      </Section>

      <Section id="testimonials" label="Client Feedback" title="What Our Clients Say">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Reveal key={n} delay={100 + n * 80}>
              <PendingSlot label="Verified testimonial" note={WORK.testimonials} />
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand title="Have a similar project? Let's discuss it." primary={{ label: 'Work With EMG', to: '/request-a-proposal' }} />
    </>
  );
}
