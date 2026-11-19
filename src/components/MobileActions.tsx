import { MessageCircle } from 'lucide-react';
import { Link, useLocation } from '../lib/router';
import { CONTACT } from '../data/site';

/** Sticky mobile action bar: proposal CTA always within thumb reach, plus WhatsApp (brief §14). */
export default function MobileActions() {
  const { path } = useLocation();
  if (path === '/request-a-proposal') return null;
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 flex gap-2 sm:hidden">
      <Link
        to="/request-a-proposal"
        className="flex-1 rounded-full bg-white py-3.5 text-center text-sm font-medium text-black shadow-lg shadow-black/40"
      >
        Request a Proposal
      </Link>
      {CONTACT.whatsapp && (
        <a
          href={`https://wa.me/${CONTACT.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with EMG on WhatsApp"
          className="grid w-12 place-items-center rounded-full border border-white/25 bg-card"
        >
          <MessageCircle size={18} />
        </a>
      )}
    </div>
  );
}
