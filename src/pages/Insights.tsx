import { useState } from 'react';
import Reveal from '../components/Reveal';
import { CtaBand, PageHero, Section } from '../components/Sections';
import { PendingSlot, mono } from '../components/ui';
import { INSIGHTS, POSTS } from '../data/site';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function Insights() {
  useDocumentTitle('Insights & News');
  const [cat, setCat] = useState<string>('All');
  const posts = cat === 'All' ? POSTS : POSTS.filter((p) => p.category === cat);
  return (
    <>
      <PageHero art="browser"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Insights & News' }]}
        badge="Insights & News"
        title={
          <>
            Knowledge. Ideas.
            <br />
            Industry Perspectives.
          </>
        }
        aside={INSIGHTS.body}
      />
      <Section>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-5">
          {INSIGHTS.categories.map((c, i) => (
            <Reveal key={c.title} delay={80 + i * 70}>
              <button
                onClick={() => setCat(cat === c.title ? 'All' : c.title)}
                aria-pressed={cat === c.title}
                className={`flex h-full w-full flex-col justify-between gap-8 p-5 text-left transition-colors duration-300 ${
                  cat === c.title ? 'bg-accent/20' : 'bg-card hover:bg-paper-2'
                }`}
              >
                <span className={`font-mono text-[11px] tracking-[0.15em] ${cat === c.title ? 'text-accent' : 'text-white/60'}`}>0{i + 1}</span>
                <span>
                  <span className="block text-lg text-white">{c.title}</span>
                  <span className="mt-2 block text-xs leading-relaxed text-white/60">{c.body}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </Section>
      <Section label={cat === 'All' ? 'Latest' : cat}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.length
            ? posts.map((p, i) => (
                <Reveal key={p.slug} delay={80 + (i % 3) * 80}>
                  <article className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-white/15 bg-card p-6">
                    <span className={`${mono} text-[10px] text-accent`}>
                      {p.category} · {p.date}
                    </span>
                    <div>
                      <h3 className="text-xl text-white">{p.title}</h3>
                      <p className="mt-2 text-sm text-white/70">{p.excerpt}</p>
                    </div>
                  </article>
                </Reveal>
              ))
            : [1, 2, 3].map((n) => (
                <Reveal key={n} delay={80 + n * 80}>
                  <PendingSlot label="Article" note="Published articles from src/data/site.ts → POSTS appear here." />
                </Reveal>
              ))}
        </div>
      </Section>
      <CtaBand title={INSIGHTS.cta} secondary={null} primary={{ label: 'Contact Our Team', to: '/contact' }} />
    </>
  );
}
