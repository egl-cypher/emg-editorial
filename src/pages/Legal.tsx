import Reveal from '../components/Reveal';
import { PageHero, Section } from '../components/Sections';
import { Panel, mono } from '../components/ui';
import { useDocumentTitle } from '../lib/useDocumentTitle';

/** Placeholder legal pages — EMG must supply legally reviewed text before launch. */
export default function Legal({ title }: { title: string }) {
  useDocumentTitle(title);
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: title }]} badge="Legal" title={title} />
      <Section>
        <Reveal>
          <Panel className="max-w-3xl p-7 sm:p-9">
            <span className={`${mono} text-[10px] text-accent`}>Content pending</span>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Exclusive Multimedia Group's {title.toLowerCase()} will be published here. This text must be prepared or
              reviewed by EMG's legal adviser before the website goes live.
            </p>
          </Panel>
        </Reveal>
      </Section>
    </>
  );
}
