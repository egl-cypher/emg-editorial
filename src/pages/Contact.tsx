import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import Reveal from '../components/Reveal';
import { EnquiryForm } from '../components/Forms';
import { PageHero, Section } from '../components/Sections';
import { IndexRow, Panel, mono } from '../components/ui';
import { CONTACT, CONTACT_PAGE, NETWORK } from '../data/site';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function Contact() {
  useDocumentTitle('Contact');
  return (
    <>
      <PageHero art="route"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        badge="Contact EMG"
        title={
          <>
            Let's Discuss Your
            <br />
            Next Project.
          </>
        }
        aside={CONTACT_PAGE.body}
      />

      <Section label="Ways to engage EMG">
        <Panel className="px-5 sm:px-6">
          <div className="grid md:grid-cols-2 md:gap-x-10">
            {CONTACT_PAGE.routes.map((r, i) => (
              <Reveal key={r.title} delay={80 + i * 80}>
                <IndexRow n={String(i + 1).padStart(2, '0')} title={r.title} body={r.body} to={r.to} last={i >= 2} />
              </Reveal>
            ))}
          </div>
        </Panel>
      </Section>

      <Section id="enquiry" label="General Enquiries" title="Send us an enquiry.">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <Panel className="p-6 sm:p-8">
              <EnquiryForm confirm={CONTACT_PAGE.enquiryConfirm} />
            </Panel>
          </Reveal>
          <Reveal delay={150}>
            <Panel className="p-6 sm:p-7 lg:sticky lg:top-28">
              <span className={`${mono} text-[11px] text-accent`}>Contact details</span>
              <p className="mt-4 text-lg text-white">Exclusive Multimedia Group (EMG)</p>
              <ul className="mt-5 grid gap-4 text-sm text-white/85">
                <li className="flex gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-white/60" />
                  <span>
                    {CONTACT.addressLines.map((l) => (
                      <span key={l} className="block">{l}</span>
                    ))}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone size={16} className="mt-0.5 shrink-0 text-white/60" />
                  <span className="grid gap-1">
                    {CONTACT.phones.map((p) => (
                      <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="hover:text-white">{p}</a>
                    ))}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Mail size={16} className="mt-0.5 shrink-0 text-white/60" />
                  {CONTACT.email ? (
                    <a href={`mailto:${CONTACT.email}`} className="hover:text-white">{CONTACT.email}</a>
                  ) : (
                    <span className="text-white/60">Official email to be confirmed</span>
                  )}
                </li>
                {CONTACT.whatsapp && (
                  <li className="flex gap-3">
                    <MessageCircle size={16} className="mt-0.5 shrink-0 text-white/60" />
                    <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-white">
                      Chat on WhatsApp
                    </a>
                  </li>
                )}
              </ul>
              <div className="mt-6 border-t border-white/15 pt-5">
                <span className={`${mono} text-[10px] text-white/60`}>Regional team network</span>
                <p className="mt-2 text-sm text-white/80">{NETWORK.map((n) => n.country).join(' | ')}</p>
              </div>
            </Panel>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
