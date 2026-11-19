import Reveal from '../components/Reveal';
import { PageHero, Section } from '../components/Sections';
import { Badge, Button, Eyebrow, IndexRow, Panel, PendingSlot, TickList, headline, headlineMd, mono } from '../components/ui';
import { Input, Select, Chips } from '../components/Forms';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const colors = [
  ['Paper', '#f3efe8', 'Page background (token: black)'],
  ['Ink', '#16130f', 'Text, primary buttons (token: white)'],
  ['REC red', '#c8381a', 'Accent: live state, focus, HQ, progress'],
  ['Accent soft', '#e2603f', 'Accent hover'],
  ['Accent deep', '#9e2a12', 'Pressed accent'],
  ['Card', '#faf8f4', 'Sheets, form fields, menus'],
  ['Moss', '#3f5a3c', 'Secondary accent'],
];
const whites = [
  ['white/90', 'Mono eyebrows on photos'],
  ['white/80', 'Body copy'],
  ['white/70', 'Secondary body'],
  ['white/55', 'Indices, labels'],
  ['white/25', 'Strong borders'],
  ['white/15', 'Hairline borders / dividers'],
  ['white/10', 'Subtle chip tint'],
];

export default function DesignSystem() {
  useDocumentTitle('Design System');
  return (
    <>
      <PageHero
        badge="EMG Design System v1"
        title={
          <>
            Studio paper.
            <br />
            One warm accent.
          </>
        }
        aside="Ink type on warm paper sheets, Fraunces headlines over Geist text, and one vermilion accent. Motion runs on GSAP and Lenis. Every page on the EMG site uses these tokens and components."
      />

      <Section label="Principles">
        <Panel className="px-5 sm:px-6">
          {[
            ['Paper is the canvas', 'A flat paper backdrop with solid sheets laid on it. No frosted glass, no blur, no gradient orbs.'],
            ['Sheets, not glass', 'Content sits on solid card sheets with an ink hairline border and a soft shadow. Lists are numbered index rows, not icon card grids.'],
            ['Vermilion means "live"', 'The accent marks state: active nav, current step, the HQ, focus rings and checked choices. It is never used for large fills.'],
            ['Editorial calm', 'Big, light Fraunces headlines, plenty of space, mono uppercase labels at 0.15em tracking.'],
            ['Motion with intent', 'GSAP drives every reveal: headings rise word by word behind a mask, blocks rise 32px with a slight tilt, 1.1s on expo-out. Scroll-linked sections read a ScrollTrigger progress value. Reduced motion shows everything at rest.'],
            ['Proposal everywhere', 'Every page ends with a route to Request a Proposal. On mobile it stays in a sticky bar.'],
            ['Only verified content', 'Placeholders are visibly marked "Awaiting verified content". Nothing is invented.'],
          ].map(([t, b], i, a) => (
            <Reveal key={t} delay={60 + i * 60}>
              <IndexRow n={String(i + 1).padStart(2, '0')} title={t} body={b} last={i === a.length - 1} />
            </Reveal>
          ))}
        </Panel>
      </Section>

      <Section label="Colour">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {colors.map(([n, hex, use]) => (
            <Panel key={n} className="overflow-hidden">
              <div className="h-24 border-b border-white/15" style={{ background: hex }} />
              <div className="p-4">
                <p className="text-sm text-white">{n}</p>
                <p className={`${mono} mt-1 text-[10px] text-white/60`}>{hex}</p>
                <p className="mt-2 text-xs text-white/60">{use}</p>
              </div>
            </Panel>
          ))}
        </div>
        <Panel className="mt-6 px-5 sm:px-6">
          {whites.map(([cls, use], i) => (
            <div key={cls} className={`flex items-center gap-5 py-3.5 ${i < whites.length - 1 ? 'border-b border-white/10' : ''}`}>
              <span className="h-6 w-14 rounded border border-white/10" style={{ background: `rgba(255,255,255,${Number(cls.split('/')[1]) / 100})` }} />
              <span className={`${mono} w-24 text-[11px] text-white`}>{cls}</span>
              <span className="text-sm text-white/65">{use}</span>
            </div>
          ))}
        </Panel>
      </Section>

      <Section label="Typography" intro="Inter 400/500/600/700 only. The font-mono class also maps to Inter; set it uppercase with 0.15em tracking.">
        <Panel className="grid gap-8 p-6 sm:p-9">
          <div>
            <span className={`${mono} text-[10px] text-white/60`}>Display · 48/60/72 · 400 · 1.05 · tight</span>
            <p className={`${headline} mt-2`}>Ideas Into Impact.</p>
          </div>
          <div>
            <span className={`${mono} text-[10px] text-white/60`}>Heading · 36/48 · 400</span>
            <p className={`${headlineMd} mt-2`}>One Group. Multiple Solutions.</p>
          </div>
          <div>
            <span className={`${mono} text-[10px] text-white/60`}>Lead · 18/20 · relaxed</span>
            <p className="mt-2 max-w-xl text-lg leading-relaxed text-white sm:text-xl">We bring the expertise, technology and creativity to help you communicate, connect and grow.</p>
          </div>
          <div>
            <span className={`${mono} text-[10px] text-white/60`}>Body · 14/16 · white/80</span>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">Professional planning, management and technical delivery for conferences, corporate events, summits, exhibitions and hybrid engagements.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Eyebrow>Media Production</Eyebrow>
            <span className="font-mono text-[11px] tracking-[0.15em] text-white/60">01</span>
          </div>
        </Panel>
      </Section>

      <Section label="Components">
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel className="grid content-start gap-6 p-6 sm:p-8">
            <span className={`${mono} text-[10px] text-white/60`}>Buttons</span>
            <div className="flex flex-wrap gap-3">
              <Button to="#">Request a Proposal</Button>
              <Button to="#" variant="secondary">Explore Our Services</Button>
              <Button to="#" variant="accent">Accent (rare)</Button>
              <Button to="#" size="sm">Small</Button>
            </div>
            <span className={`${mono} text-[10px] text-white/60`}>Badges</span>
            <div className="flex flex-wrap gap-3">
              <Badge>Insight label</Badge>
              <Badge accent>Page badge</Badge>
            </div>
            <span className={`${mono} text-[10px] text-white/60`}>Tick list</span>
            <TickList items={['Conference and event management', 'Hybrid and virtual event production', 'Post-event reporting and documentation']} />
          </Panel>
          <Panel className="px-5 sm:px-6">
            <p className={`${mono} pt-5 text-[10px] text-white/60`}>Index rows</p>
            <IndexRow n="01" title="Events & Experiences" body="Hover: index turns vermilion, chevron nudges right." to="#" />
            <IndexRow n="02" title="Media Production" body="Used for services, values, steps and routes." to="#" />
            <IndexRow n="03" title="Digital Solutions & Technology" to="#" last />
          </Panel>
          <Panel className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
            <span className={`${mono} text-[10px] text-white/60 sm:col-span-2`}>Form fields</span>
            <Input label="Full name" name="ds-name" required />
            <Select label="Country" name="ds-country" options={['Liberia', 'Ghana']} />
            <Chips label="Preferred method of contact" name="ds-contact" options={['Email', 'Phone call', 'WhatsApp']} />
          </Panel>
          <PendingSlot label="Pending slot" note="Marks where verified projects, testimonials or team profiles will go." />
        </div>
      </Section>

      <Section label="Motion">
        <Panel className="px-5 sm:px-6">
          {[
            ['Smooth scroll', 'Lenis (1.15s, expo-out) on the GSAP ticker, synced to ScrollTrigger. Scroll-linked sections read a 0–1 --p progress from ScrollTrigger.'],
            ['Reveal', 'GSAP + ScrollTrigger at 85% · headings rise word by word behind a mask (55ms stagger) · blocks rise 32px with a 0.6° tilt · 1.1s expo-out. Visible without JavaScript.'],
            ['Brand line', 'Create / Capture / Connect light up in turn on a sticky 180vh stage.'],
            ['State', 'Colour transitions 300ms. Vermilion pulse on HQ. Marquee 45s linear, pauses on hover.'],
            ['Reduced motion', 'No smooth scroll, no scrubbing, reveals shown at rest; CSS transitions and animations cut to 1ms.'],
          ].map(([t, b], i, a) => (
            <IndexRow key={t} n={String(i + 1).padStart(2, '0')} title={t} body={b} last={i === a.length - 1} />
          ))}
        </Panel>
      </Section>
    </>
  );
}
