import { useState, type FormEvent, type ReactNode } from 'react';
import { Check, ChevronLeft, ChevronRight, Paperclip } from 'lucide-react';
import { CONTACT, COUNTRIES, DIVISIONS } from '../data/site';
import { mono } from './ui';

/* ───────── Field primitives ───────── */

const control =
  'w-full rounded-lg border border-white/20 bg-card px-4 py-3 text-sm text-white placeholder:text-white/35 transition-colors duration-300 focus:border-accent focus:bg-card focus:outline-none aria-invalid:border-accent';

/** File types the server accepts (server/files.mjs). */
const ACCEPT = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.webp';

type FieldProps = { label: string; name: string; required?: boolean; optional?: boolean; hint?: string; full?: boolean };

function Label({ label, required, optional, htmlFor }: { label: string; required?: boolean; optional?: boolean; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className={`${mono} mb-2 flex items-center gap-2 text-[10px] text-white/65`}>
      {label}
      {required && <span className="text-accent">*</span>}
      {optional && <span className="normal-case tracking-normal text-white/60">(optional)</span>}
    </label>
  );
}

export function Input({ label, name, required, optional, hint, full, type = 'text', placeholder }: FieldProps & { type?: string; placeholder?: string }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <Label label={label} required={required} optional={optional} htmlFor={name} />
      <input id={name} name={name} type={type} required={required} placeholder={placeholder} className={control} />
      {hint && <p className="mt-1.5 text-xs text-white/60">{hint}</p>}
    </div>
  );
}

export function TextArea({ label, name, required, optional, full = true, placeholder, rows = 5 }: FieldProps & { placeholder?: string; rows?: number }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <Label label={label} required={required} optional={optional} htmlFor={name} />
      <textarea id={name} name={name} rows={rows} required={required} placeholder={placeholder} className={`${control} resize-y`} />
    </div>
  );
}

export function Select({ label, name, required, optional, full, options, placeholder = 'Select…' }: FieldProps & { options: string[]; placeholder?: string }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <Label label={label} required={required} optional={optional} htmlFor={name} />
      <select id={name} name={name} required={required} defaultValue="" className={`${control} appearance-none`}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export function Chips({ label, name, options, multiple }: { label: string; name: string; options: string[]; multiple?: boolean }) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className={`${mono} mb-3 text-[10px] text-white/65`}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="cursor-pointer">
            <input type={multiple ? 'checkbox' : 'radio'} name={name} value={o} className="peer sr-only" />
            <span className="inline-block rounded-full border border-white/20 bg-card px-4 py-2 text-xs text-white/80 transition-colors duration-300 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-black peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function FileInput({ label, name, optional, hint, required }: { label: string; name: string; optional?: boolean; hint?: string; required?: boolean }) {
  const [files, setFiles] = useState<string>('');
  return (
    <div className="sm:col-span-2">
      <Label label={label} optional={optional} htmlFor={name} />
      <label
        htmlFor={name}
        className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-white/25 bg-card px-4 py-4 text-sm text-white/70 transition-colors duration-300 hover:border-accent"
      >
        <Paperclip size={16} className="text-accent" />
        {files || 'Attach a brief, document or reference file'}
      </label>
      <input
        id={name}
        name={name}
        type="file"
        multiple
        accept={ACCEPT}
        required={!optional && required}
        className="sr-only"
        onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name).join(', '))}
      />
      {hint && <p className="mt-1.5 text-xs text-white/60">{hint}</p>}
    </div>
  );
}

/* ───────── Submission ───────── */

type Result = { ok: boolean; message?: string; errors?: Record<string, string> };

/** Sends a form to the EMG server (server/app.mjs): POST {formEndpoint}/{kind} as multipart/form-data. */
async function submit(form: HTMLFormElement, kind: string): Promise<Result> {
  const data = new FormData(form);
  if (!CONTACT.formEndpoint) {
    // No backend configured: simulate success so the flow can be reviewed.
    await new Promise((r) => setTimeout(r, 600));
    return { ok: true };
  }
  const res = await fetch(`${CONTACT.formEndpoint.replace(/\/$/, '')}/${kind}`, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
  const body = (await res.json().catch(() => ({}))) as Result;
  return { ok: res.ok && body.ok !== false, message: body.message, errors: body.errors };
}

/** Hidden spam trap: people never see or fill it; bots that fill every field are silently dropped. */
function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this empty
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

function Confirmation({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-start gap-5 py-6" role="status">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-black">
        <Check size={20} />
      </span>
      <p className="max-w-lg text-xl leading-relaxed text-white">{message}</p>
    </div>
  );
}

function SubmitButton({ children, busy }: { children: ReactNode; busy: boolean }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex items-center gap-1 rounded-full bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.1em] text-black transition-colors duration-300 hover:bg-accent disabled:opacity-60"
    >
      {busy ? 'Sending…' : children}
      {!busy && <ChevronRight size={14} />}
    </button>
  );
}

type Issue = { name: string; label: string; message: string };

function useSubmit(kind: string) {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [message, setMessage] = useState<string | undefined>();
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    setIssues([]);
    setMessage(undefined);
    setState('busy');
    try {
      const r = await submit(form, kind);
      if (r.ok) return setState('done');
      const found = Object.entries(r.errors ?? {}).map(([name, msg]) => {
        const el = form.querySelector<HTMLElement>(`[name="${name}"]`);
        el?.setAttribute('aria-invalid', 'true');
        const label = form.querySelector(`label[for="${name}"]`)?.firstChild?.textContent?.trim() || el?.closest('fieldset')?.querySelector('legend, span')?.textContent?.replace('*', '').trim() || name;
        return { name, label, message: msg };
      });
      setIssues(found);
      setMessage(r.message);
      setState('error');
    } catch {
      setState('error');
    }
  };
  return { state, onSubmit, issues, message };
}

function ErrorNote({ issues = [], message }: { issues?: Issue[]; message?: string }) {
  if (issues.length)
    return (
      <div className="text-sm text-accent-soft" role="alert">
        <p>{message ?? 'Please check the highlighted fields.'}</p>
        <ul className="mt-1 list-disc pl-5">
          {issues.map((i) => (
            <li key={i.name}>
              {i.label}: {i.message}
            </li>
          ))}
        </ul>
      </div>
    );
  return (
    <p className="text-sm text-accent-soft" role="alert">
      {message ?? 'Something went wrong sending your message.'} Please try again, or call us on {CONTACT.phones[0]}.
    </p>
  );
}

const services = DIVISIONS.map((d) => d.title);

/* ───────── Website enquiry form (Contact page) ───────── */

export function EnquiryForm({ confirm }: { confirm: string }) {
  const { state, onSubmit, issues, message } = useSubmit('enquiry');
  if (state === 'done') return <Confirmation message={confirm} />;
  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <Honeypot />
      <Input label="Full name" name="name" required />
      <Input label="Organisation or company" name="organisation" />
      <Input label="Email address" name="email" type="email" required />
      <Input label="Telephone number" name="phone" type="tel" />
      <Select label="Country" name="country" options={COUNTRIES} />
      <Select label="Service required" name="service" options={[...services, 'Not sure yet']} />
      <TextArea label="Project description" name="description" required placeholder="Tell us briefly what you need." />
      <Input label="Expected timeline" name="timeline" placeholder="e.g. March 2026, or within 6 weeks" />
      <Input label="Estimated budget" name="budget" optional />
      <FileInput label="File attachment" name="attachment" optional />
      <Chips label="Preferred method of contact" name="contactMethod" options={['Email', 'Phone call', 'WhatsApp']} />
      <div className="flex flex-wrap items-center gap-4 pt-2 sm:col-span-2">
        <SubmitButton busy={state === 'busy'}>Send Enquiry</SubmitButton>
        {state === 'error' && <ErrorNote issues={issues} message={message} />}
      </div>
    </form>
  );
}

/* ───────── Request a proposal: 4-step form ───────── */

const STEPS = ['You', 'Project', 'Scope & timing', 'Budget & files'] as const;

export function ProposalForm({ confirm, defaultService }: { confirm: string; defaultService?: string }) {
  const { state, onSubmit, issues, message } = useSubmit('proposal');
  const [step, setStep] = useState(0);

  if (state === 'done') return <Confirmation message={confirm} />;

  const next = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.form!;
    const fields = form.querySelectorAll<HTMLInputElement>(`[data-step="${step}"] [required]`);
    for (const f of Array.from(fields)) {
      if (!f.checkValidity()) {
        f.reportValidity();
        return;
      }
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const pane = (i: number, children: ReactNode) => (
    <div data-step={i} className={`grid gap-5 sm:grid-cols-2 ${step === i ? '' : 'hidden'}`}>
      {children}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate={false}>
      <Honeypot />
      {/* progress */}
      <ol className="mb-10 grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button type="button" onClick={() => i < step && setStep(i)} className="w-full text-left" disabled={i > step}>
              <span className={`block h-0.5 rounded-full transition-colors duration-500 ${i <= step ? 'bg-accent' : 'bg-white/15'}`} />
              <span className={`${mono} mt-3 block text-[10px] ${i === step ? 'text-white' : 'text-white/60'}`}>
                0{i + 1} <span className="hidden sm:inline">· {s}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      {pane(
        0,
        <>
          <Input label="Name" name="name" required />
          <Input label="Organisation" name="organisation" required />
          <Input label="Email" name="email" type="email" required />
          <Input label="Telephone" name="phone" type="tel" required />
          <Select label="Country" name="country" options={COUNTRIES} required />
          <Input label="Project location" name="location" placeholder="City / venue, if known" />
        </>,
      )}
      {pane(
        1,
        <>
          <div className="sm:col-span-2">
            <span className={`${mono} mb-3 block text-[10px] text-white/65`}>
              Service category <span className="text-accent">*</span>
            </span>
            <div className="grid gap-2 sm:grid-cols-2">
              {services.map((s, i) => (
                <label key={s} className="cursor-pointer">
                  <input
                    type="radio"
                    name="service"
                    value={s}
                    required
                    defaultChecked={s === defaultService}
                    className="peer sr-only"
                  />
                  <span className="flex items-center gap-3 rounded-lg border border-white/20 bg-card px-4 py-3 text-sm text-white/85 transition-colors duration-300 peer-checked:border-accent peer-checked:bg-accent/15 peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                    <span className="font-mono text-[11px] tracking-[0.15em] text-white/60">0{i + 1}</span>
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <Input label="Project title" name="title" required full />
          <TextArea label="Project objectives and description" name="objectives" required />
        </>,
      )}
      {pane(
        2,
        <>
          <TextArea label="Expected deliverables" name="deliverables" rows={4} placeholder="e.g. 2-day conference, livestream, highlight video, photo gallery" />
          <Input label="Preferred start date" name="start" type="date" />
          <Input label="Preferred completion date" name="end" type="date" />
        </>,
      )}
      {pane(
        3,
        <>
          <Select
            label="Estimated budget"
            name="budget"
            options={['Under US$1,000', 'US$1,000 – 5,000', 'US$5,000 – 15,000', 'US$15,000 – 50,000', 'Over US$50,000', 'Prefer to discuss']}
          />
          <div />
          <FileInput label="Supporting documents or brief" name="documents" optional />
          <TextArea label="Additional requirements" name="additional" optional rows={4} />
        </>,
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={`inline-flex items-center gap-1 text-sm text-white/70 hover:text-white ${step === 0 ? 'invisible' : ''}`}
        >
          <ChevronLeft size={14} /> Back
        </button>
        {state === 'error' && <ErrorNote issues={issues} message={message} />}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-card px-6 py-3 text-xs font-medium uppercase tracking-[0.1em] text-white hover:bg-paper-2"
          >
            Continue <ChevronRight size={14} />
          </button>
        ) : (
          <SubmitButton busy={state === 'busy'}>Request My Proposal</SubmitButton>
        )}
      </div>
    </form>
  );
}

/* ───────── Partnership / careers interest form ───────── */

export function InterestForm({
  kind,
  areas,
  submitLabel,
  confirm,
  cv,
}: {
  kind: string;
  areas: string[];
  submitLabel: string;
  confirm: string;
  cv?: boolean;
}) {
  const { state, onSubmit, issues, message } = useSubmit(kind);
  if (state === 'done') return <Confirmation message={confirm} />;
  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <Honeypot />
      <Input label="Full name" name="name" required />
      <Input label={cv ? 'Current role or title' : 'Organisation'} name="organisation" required={!cv} />
      <Input label="Email address" name="email" type="email" required />
      <Input label="Telephone number" name="phone" type="tel" />
      <Select label="Country" name="country" options={COUNTRIES} />
      <Input label={cv ? 'Portfolio link' : 'Website'} name="link" type="url" optional placeholder="https://" />
      <Chips label={cv ? 'Areas of interest' : 'Partnership areas'} name="areas" options={areas} multiple />
      <TextArea label={cv ? 'Brief introduction' : 'Tell us about the partnership you have in mind'} name="message" required />
      <FileInput label={cv ? 'CV or professional profile' : 'Company profile'} name="file" optional={!cv} required={cv} />
      <div className="flex flex-wrap items-center gap-4 pt-2 sm:col-span-2">
        <SubmitButton busy={state === 'busy'}>{submitLabel}</SubmitButton>
        {state === 'error' && <ErrorNote issues={issues} message={message} />}
      </div>
    </form>
  );
}
